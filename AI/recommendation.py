import json
import pandas as pd
from contentBased import content_based_recommendations, preprocess_movies, compute_cosine_similarity
from collaborativeFiltering import item_item_collaborative_filtering
from database.database import fetch_data

def hybrid_recommendation(user_id, ratings,cosine_similarity_matrix, k=10, weight_content_based=1, weight_collaborative=0.0, rating_threshold=5):
    # Fetch content-based recommendations
    content_based_recs = content_based_recommendations(user_id, ratings, cosine_similarity_matrix, k, rating_threshold)


    # Fetch item-item collaborative filtering recommendations
    user_rated_movies = ratings[ratings['user_id'] == user_id]

    if len(user_rated_movies) > 0:
        last_rated_movie = user_rated_movies.iloc[-1]['movie_id']
        collaborative_recs = item_item_collaborative_filtering(last_rated_movie)
    else:
        print(f"No rated movies found for user {user_id}.")
        return content_based_recs

    # Combine both recommendations
    content_based_recs = content_based_recs.copy()
    content_based_recs['score'] = content_based_recs.index.map(lambda x: weight_content_based * (k - x))
    collaborative_recs = collaborative_recs.copy()
    collaborative_recs['score'] = collaborative_recs.index.map(lambda x: weight_collaborative * (k - x))

    combined_recommendations = pd.concat([content_based_recs, collaborative_recs]).drop_duplicates(subset=['movie_id'])
    combined_recommendations.sort_values(by='score', ascending=False, inplace=True)

    return combined_recommendations.head(k)

if __name__ == "__main__":
    # Load movie data from JSON file
    with open("movie_details.json", "r") as f:
        data = json.load(f)

    movies = pd.DataFrame(data)
    preprocessed_movies = preprocess_movies(movies)
    cosine_similarity_matrix = compute_cosine_similarity(preprocessed_movies)

    user_id = 5  # Replace with the user ID for which you want recommendations
    ratings_data = fetch_data()
    ratings = pd.DataFrame(json.loads(ratings_data))

    recommended_movies = hybrid_recommendation(user_id, ratings,cosine_similarity_matrix)
    print(recommended_movies)
