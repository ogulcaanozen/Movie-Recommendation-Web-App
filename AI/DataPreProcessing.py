import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler
import random
from database.database import fetch_data
from collections import Counter
from itertools import chain
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt


def calculate_euclidean_distance(point, centroid):
    return np.sqrt(np.sum((np.array(point) - np.array(centroid)) ** 2))

def assign_data_to_clusters(data, centroids):
    clusters = {}
    for idx, point in enumerate(data):
        centroid_distances = [calculate_euclidean_distance(point, centroid) for centroid in centroids]
        closest_centroid = np.argmin(centroid_distances)
        if closest_centroid in clusters:
            clusters[closest_centroid].append(idx)
        else:
            clusters[closest_centroid] = [idx]
    return clusters

def update_centroids(data, clusters):
    new_centroids = []
    for key in clusters.keys():
        cluster_data = np.array([data[i] for i in clusters[key]])
        cluster_mean = np.mean(cluster_data, axis=0)
        new_centroids.append(cluster_mean)
    return new_centroids

def k_means(data, k, max_iter=100):
    random_indices = random.sample(range(len(data)), k)
    centroids = [data[i] for i in random_indices]

    for _ in range(max_iter):
        clusters = assign_data_to_clusters(data, centroids)
        centroids = update_centroids(data, clusters)

    return centroids, clusters

def get_most_common(df, column, top_n):
    counter = Counter()
    for row in df[column]:
        counter.update(row)
    return set([item[0] for item in counter.most_common(top_n)])

def replace_less_common(df, column, top_n):
    most_common = get_most_common(df, column, top_n)
    df[column] = df[column].apply(lambda row: [val if val in most_common else 'others' for val in row])


def clusteringRecommendation(user_id):
    # Most common categories
    most_common_genres = {'Drama', 'Family', 'Action', 'Thriller', 'Fantasy', 'Comedy', 'Animation', 'Adventure'}
    most_common_production_companies = {'Paramount', '20th Century Fox', 'Warner Bros. Pictures', 'New Line Cinema', 'Lionsgate', 'Universal Pictures', 'Columbia Pictures', 'Walt Disney Pictures'}

    # Read data from a JSON file
    with open('movie_details.json') as f:
        data = json.load(f)

    # Create a pandas DataFrame
    df = pd.DataFrame(data)

    # Call the fetch_data function
    user_ratings_json = fetch_data()

    # Convert the returned JSON data to a pandas DataFrame
    user_ratings_df = pd.read_json(user_ratings_json)

    # Extract the liked movies and their ratings for this user
    user_likes_df = user_ratings_df[user_ratings_df['user_id'] == user_id][['movie_id', 'rating']]

    # Set less common genres and production companies to 'others'
    df['genres'] = df['genres'].apply(lambda x: [genre if genre in most_common_genres else 'others' for genre in x])
    df['production_companies'] = df['production_companies'].apply(lambda x: [company if company in most_common_production_companies else 'others' for company in x])

    for column in ["genres", "production_companies", "production_countries"]:
        df[column] = df[column].apply(lambda x: ', '.join(map(str, x)))

    df_encoded = pd.get_dummies(df, columns=["genres", "production_companies", "production_countries"])

    df_encoded["original_language"] = pd.Categorical(df_encoded["original_language"])
    df_encoded = pd.get_dummies(df_encoded, columns=["original_language"])

    minmax_scaler = MinMaxScaler()
    df_encoded['budget'] = minmax_scaler.fit_transform(df_encoded[['budget']])

    scaler = StandardScaler()
    numeric_columns = ["runtime", "vote_average"]
    df_encoded[numeric_columns] = scaler.fit_transform(df_encoded[numeric_columns])

    df_encoded['adult'] = df_encoded['adult'].astype(int)

    bool_cols = [col for col in df_encoded if df_encoded[col].dtype == np.dtype('bool')]

    for col in bool_cols:
        df_encoded[col] = df_encoded[col].astype(int)

    merged_df = pd.merge(user_likes_df, df_encoded, on='movie_id')

    weighted_movies = merged_df.drop('rating', axis=1).mul(merged_df['rating'], axis=0)

    user_profile = weighted_movies.mean()

    centroids, clusters = k_means(df_encoded.values, 10)

    # Reduce the data to 2D for visualization
    pca = PCA(n_components=2)
    reduced_data = pca.fit_transform(df_encoded.values)

    # Transform the centroids to the same reduced space
    reduced_centroids = pca.transform(centroids)

    # Transform the user profile to the same reduced space
    reduced_user_profile = pca.transform(user_profile.values.reshape(1, -1))

    # Assign the reduced user profile to a cluster
    user_cluster = assign_data_to_clusters(reduced_user_profile, reduced_centroids)

    user_cluster_num = list(user_cluster.keys())[0]

    movie_indices = clusters[user_cluster_num]

    recommended_movie_ids = df_encoded.iloc[movie_indices]['movie_id'].values

    # Create a DataFrame for the reduced data
    reduced_df = pd.DataFrame(reduced_data, columns=['PC1', 'PC2'])

    # Assign each data point to a cluster
    reduced_df['cluster'] = [list(assign_data_to_clusters([point], reduced_centroids).keys())[0] for point in reduced_data]


    return recommended_movie_ids, reduced_df



def plot_clusters(df):
    fig, ax = plt.subplots()

    for cluster, group in df.groupby('cluster'):
        ax.scatter(group['PC1'], group['PC2'], label=f'Cluster {cluster}')

    ax.legend()
    plt.title('Movie Clusters')
    plt.xlabel('PC1')
    plt.ylabel('PC2')

    plt.show()


recommended_movie_ids, cluster_df = clusteringRecommendation(3)
plot_clusters(cluster_df)


