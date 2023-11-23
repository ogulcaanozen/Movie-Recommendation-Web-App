import requests
import json

def fetch_movie_details(movie_id, api_key):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US'
    response = requests.get(url)
    data = response.json()

    movie_details = {
        'movie_id': data['id'],
        'genres': [genre['name'] for genre in data['genres']],
        'production_companies': [company['name'] for company in data['production_companies']],
        'original_language': data['original_language'],
        'production_countries': [country['name'] for country in data['production_countries']],
        'runtime': data['runtime'],
        'vote_average': data['vote_average'],
        'budget': data['budget'],
        'adult': data['adult']
    }

    return movie_details

api_key = '9cec5129d32cd0fc174b0a5bdea0e726'

with open('movies.json', 'r') as json_file:
    data = json.load(json_file)
    movie_ids = data

all_movie_details = []

for movie_id in movie_ids:
    movie_details = fetch_movie_details(movie_id, api_key)
    all_movie_details.append(movie_details)

# Save the result in a JSON file
with open('movie_details.json', 'w') as json_file:
    json.dump(all_movie_details, json_file, indent=4)
