from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import json
import pandas as pd
import numpy as np
from database.database import fetch_data
from contentBased import content_based_recommendations, preprocess_movies, compute_cosine_similarity, softmax
from collaborativeFiltering import create_utility_matrix
from sklearn.neighbors import NearestNeighbors
from DataPreProcessing import clusteringRecommendation


app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/recommend', methods=['POST'])
def recommend_movies():
    user_id = request.json['user_id']
    
    with open("movie_details.json", "r") as f:
        data = json.load(f)

    movies = pd.DataFrame(data)
    preprocessed_movies = preprocess_movies(movies)
    cosine_similarity_matrix = compute_cosine_similarity(preprocessed_movies)

    ratings_data = fetch_data()
    ratings = pd.DataFrame(json.loads(ratings_data))

    # Call the recommendation function with the user_ratings
    recommended_movies = content_based_recommendations(user_id, ratings, cosine_similarity_matrix, k=40, rating_threshold=5)

    recommended_movies['probability_percentage'] = (recommended_movies['probability'] * 10000).round(2)

    return jsonify(recommended_movies.to_dict(orient='records'))  # Convert DataFrame to dictionary


@app.route('/collaborativeRecommend', methods=['POST'])
def collaborative_recommend_movies():
    user_id = request.json['user_id']
    
    with open("movies.json", "r") as f:
        data = json.load(f)

    movies = pd.DataFrame(data, columns=['movie_id'])

    ratings_data = fetch_data()
    ratings = pd.DataFrame(json.loads(ratings_data))
    utility_matrix = create_utility_matrix(ratings)

    model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20)
    model_knn.fit(utility_matrix.T.values)

    def item_item_collaborative_filtering(user_id, movie_id, k=3):
        if movie_id not in utility_matrix.columns:
            print(f"Movie ID {movie_id} not found in the utility matrix.")
            return None

        # Find the k nearest neighbors to the movie
        distances, indices = model_knn.kneighbors(utility_matrix[movie_id].values.reshape(1, -1), n_neighbors=k + 1)
        recommended_movie_ids = [utility_matrix.columns[i] for i in indices.flatten()[1:]]

        # Check if the user has already rated these movies
        user_ratings = ratings[ratings['user_id'] == user_id]
        rated_movie_ids = user_ratings['movie_id'].values

        # Exclude movies that the user has already rated
        recommended_movie_ids = [movie_id for movie_id in recommended_movie_ids if movie_id not in rated_movie_ids]

        # Get movie details for the recommended movies
        recommended_movies = movies[movies["movie_id"].isin(recommended_movie_ids)]

        return recommended_movies

    # Get the movies that the user liked (rated over 5)
    liked_movies = ratings[(ratings['user_id'] == user_id) & (ratings['rating'] > 5)]['movie_id'].values

    # Get recommendations for each liked movie
    all_recommended_movies = pd.DataFrame()
    for movie_id in liked_movies:
        recommended_movies = item_item_collaborative_filtering(user_id, movie_id,k=10)
        if recommended_movies is not None:  # Check if the return is not None
            recommended_movies['based_on_movie_id'] = movie_id  # Add a column specifying which movie this recommendation is based on
        all_recommended_movies = pd.concat([all_recommended_movies, recommended_movies])



    # Remove duplicate recommendations
    all_recommended_movies = all_recommended_movies.drop_duplicates()

    # You may want to add a limit to the number of recommendations
    all_recommended_movies = all_recommended_movies.head(100)

    return jsonify(all_recommended_movies.to_dict(orient='records'))  # Convert DataFrame to dictionary


@app.route('/clusteringRecommendation', methods=['POST'])
def clustering_recommend_movies():
    user_id = request.json['user_id']

    with open("movies.json", "r") as f:
        data = json.load(f)

    movies = pd.DataFrame(data, columns=['movie_id'])

    # Call the clusteringRecommendation function with the user_id
    recommended_movie_ids = clusteringRecommendation(user_id)

    # Get movie details for the recommended movies
    recommended_movies = movies[movies["movie_id"].isin(recommended_movie_ids)]

    return jsonify(recommended_movies.to_dict(orient='records'))  # Convert DataFrame to dictionary


if __name__ == '__main__':
    app.run(debug=True, port=5000)
