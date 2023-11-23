import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from database.database import fetch_data
import matplotlib.pyplot as plt

# Load movie data from JSON file
with open("movie_details.json", "r") as f:
    data = json.load(f)

movies = pd.DataFrame(data)

# Preprocess the movie data to create feature vectors
def preprocess_movies(movies):
    # Convert budget to numeric type and replace '0' budgets with 'nan'
    movies['budget'] = pd.to_numeric(movies['budget'], errors='coerce')
    movies.loc[movies['budget'] == 0, 'budget'] = np.nan

    # Calculate the average budget
    average_budget = movies['budget'].mean()

    # Replace 'nan' budgets with the average budget
    movies['budget'].fillna(average_budget, inplace=True)

    movies['combined_features'] = (
        movies['genres'].apply(lambda x: ' '.join(x)) + ' ' +
        movies['production_companies'].apply(lambda x: ' '.join(x)) + ' ' +
        movies['original_language'] + ' ' +
        movies['production_countries'].apply(lambda x: ' '.join(x)) + ' ' +
        movies['runtime'].astype(str) + ' ' +
        movies['vote_average'].astype(str) + ' ' +
        movies['budget'].astype(str) + ' ' +
        movies['adult'].astype(str)
    )

    return movies


preprocessed_movies = preprocess_movies(movies)

def compute_cosine_similarity(preprocessed_movies):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(preprocessed_movies['combined_features'])
    cosine_similarity_matrix = linear_kernel(tfidf_matrix, tfidf_matrix)

    return cosine_similarity_matrix

cosine_similarity_matrix = compute_cosine_similarity(preprocessed_movies)

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()

def content_based_recommendations(user_id, ratings, cosine_similarity_matrix, k=10, rating_threshold=5):
    user_rated_movies = ratings[ratings['user_id'] == user_id]
    rated_movie_indices = preprocessed_movies.index[preprocessed_movies['movie_id'].isin(user_rated_movies['movie_id'])].tolist()

    # Filter out only the rated movies that are present in the preprocessed movies data
    user_rated_movies = user_rated_movies[user_rated_movies['movie_id'].isin(preprocessed_movies.loc[rated_movie_indices, 'movie_id'])]

    # Compute the weighted sum of cosine similarity scores for each movie based on the user's ratings
    weighted_similarity_scores = (cosine_similarity_matrix[rated_movie_indices].T * user_rated_movies['rating'].values).sum(axis=1)
    weighted_similarity_scores = pd.Series(weighted_similarity_scores, index=preprocessed_movies.index)

    # Calculate the probabilities using the softmax function
    probabilities = softmax(weighted_similarity_scores)

    # Find the top-k most similar movies, excluding the user's rated movies
    recommended_movie_indices = probabilities.nlargest(k + len(rated_movie_indices)).index.tolist()
    recommended_movie_indices = [i for i in recommended_movie_indices if i not in rated_movie_indices][:k]

    # Get the recommended movies and their probabilities
    recommended_movies = preprocessed_movies.iloc[recommended_movie_indices].copy()  # use .copy() to avoid SettingWithCopyWarning
    recommended_movies['probability'] = probabilities[recommended_movie_indices].values

    return recommended_movies


ratings_data = fetch_data()
ratings = pd.DataFrame(json.loads(ratings_data))

# Store the recommendation counts for each movie
recommendation_counts = pd.Series(0, index=preprocessed_movies.index)

# List of user_ids to generate recommendations for
user_ids = [1,2,3,4,5]  # Replace with the actual list of user_ids

for user_id in user_ids:
    recommended_movies = content_based_recommendations(user_id, ratings, cosine_similarity_matrix, k=40, rating_threshold=5)
    recommendation_counts[recommended_movies.index] += 1

# Plot the distribution
plt.hist(recommendation_counts, bins=50)
plt.title('Recommendation Distribution')
plt.xlabel('Number of Recommendations')
plt.ylabel('Number of Movies')
plt.show()

