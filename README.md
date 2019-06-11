
# Installing the project

1. In a terminal window "cd" to project folder
2. Install npm modules with the command ```npm install```
3. Create the database with the command ```npm run seed```
4. Start the application server with the command ```npm start```
If the application starts successfully the following messages appear in the console
```
Express server is listening on port 5000
Executing (default): SELECT 1+1 AS result
Connected to database
```

## Resetting the database
The database can be reset to it's seed data or empty state with the following:
1. Stop the server by entering ctrl-C in the terminal window
2. Delete the file fsjstd-restapi.db.
3. Recreate the database with the command ```npm run seed```. Skipping this command will restart the app with an empty database.
4. Restart the application server with the command ```npm start```

# Routes

All routes, except for the root, must contain an Authorization header of type Basic Auth with the user email and unhashed password. (The unhashed password for the seed users can be found in /seed/data.json.) Requests that do not have valid credentials return status 401 with a body containing the message "Access Denied" and a warning to the console (ex: "basic auth expected", "user not found").

GET / (root) - status 200. body contains a welcome message

GET /api/users - status 200 if credentials are valid. body contains the user record. 







# === ORIGINAL NOTES FROM STARTER FILES ===

# Full Stack JavaScript Techdegree v2 - REST API Project

## Overview of the Provided Project Files

We've supplied the following files for you to use: 

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
