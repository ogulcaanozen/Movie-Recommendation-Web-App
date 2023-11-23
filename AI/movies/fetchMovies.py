import requests
import json

API_KEY = '9cec5129d32cd0fc174b0a5bdea0e726'
BASE_URL = 'https://api.themoviedb.org/3'
POPULAR_MOVIES_ENDPOINT = '/movie/popular'
NUM_PAGES = 100

def get_popular_movies(api_key, num_pages):
    movie_ids = []
    for page in range(1, num_pages + 1):
        url = f'{BASE_URL}{POPULAR_MOVIES_ENDPOINT}?api_key={api_key}&page={page}'
        response = requests.get(url)
        if response.status_code == 200:
            movies_data = response.json()
            movie_ids.extend(extract_movie_ids(movies_data))
        else:
            print(f'Error fetching data from TMDB API for page {page}. Status code: {response.status_code}')
    return movie_ids

def extract_movie_ids(movies_data):
    movie_ids = []
    for movie in movies_data['results']:
        movie_ids.append(movie['id'])
    return movie_ids

def save_to_json_file(data, filename):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile)

if __name__ == '__main__':
    popular_movie_ids = get_popular_movies(API_KEY, NUM_PAGES)
    if popular_movie_ids:
        save_to_json_file(popular_movie_ids, 'popular_movie_ids.json')
        print(f'Popular movie IDs from the first {NUM_PAGES} pages saved to popular_movie_ids.json')
    else:
        print('Failed to fetch popular movie IDs')
