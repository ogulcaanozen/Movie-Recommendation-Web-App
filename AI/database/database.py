import mysql.connector
import json

def fetch_data():
    config = {
        'user': 'root',
        'password': 'Darkman106',
        'host': 'localhost',
        'database': 'movierecommendation',
        'raise_on_warnings': True
    }

    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()
    
    # Define the SQL query to fetch user_id, rating, and movie_id from the ratings table
    query = "SELECT user_id, rating, movie_id FROM ratings"
    
    # Execute the SQL query
    cursor.execute(query)
    
    rows = cursor.fetchall()
    cursor.close()
    cnx.close()

    # Convert the data to JSON format
    data = [{"user_id": row[0], "rating": row[1], "movie_id": row[2]} for row in rows]
    json_data = json.dumps(data)
    return json_data