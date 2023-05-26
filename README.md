# IMDb Movie Database

This is a simple application that imports movie data from a CSV file into a MySQL database and provides endpoints to query and retrieve movies based on genre and language.

# Prerequisites

Before running this application, make sure you have the following installed:

Node.js
MySQL Server
Getting Started
Clone this repository or download the source code.

# Install the dependencies by running the following command:

npm install

# Create a MySQL database and update the database configuration in app.js:

javascript
Copy code
const pool = mysql.createPool({
host: "localhost",
user: "your_username",
password: "your_password",
database: "your_database_name",
});

# Import movie data from the CSV file by making a GET request to /import endpoint:

# First run the application by Node app.js

# Visit http://localhost:3000

# Then do http://localhost:3000/import

# You can access the following endpoints:

# http://localhost:3000/movies/by-genre?genre=<genre>

Retrieve movies by genre. Replace <genre> with the desired genre.

# http://localhost:3000/movies/by-language?lang=<language>

Retrieve movies by language. Replace <language> with the desired language.

# /:

Retrieve all movies.
