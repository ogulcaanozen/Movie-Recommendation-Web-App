import json
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from database.database import fetch_data

with open("movies.json", "r") as f:
    data = json.load(f)

movies = pd.DataFrame(data, columns=['movie_id'])


def create_utility_matrix(ratings):
    utility_matrix = pd.pivot_table(ratings, values='rating', index='user_id', columns='movie_id', fill_value=0)
    return utility_matrix

ratings_data = fetch_data()

ratings = pd.DataFrame(json.loads(ratings_data))

utility_matrix = create_utility_matrix(ratings)

print(ratings)


model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20)
model_knn.fit(utility_matrix.T.values)



def item_item_collaborative_filtering(user_id, movie_id, k=10):
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



recommended_movies = item_item_collaborative_filtering(3,447365)

print(recommended_movies)






