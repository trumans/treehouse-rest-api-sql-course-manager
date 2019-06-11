
See 'Extra Credit' section for related functionality

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

**User Authentication**

Except as noted, routes must include an Authorization header of type Basic Auth with the user email and plaintext password. (Unencrypted passwords for the seed users can be found in /seed/data.json.) Requests that do not have valid credentials return status 401 with a body containing the message "Access Denied" and a warning to the console (ex: "basic auth expected", "user not found").

**GET /** (root)
* Returns status 200.
* Response body returns a welcome message. 
* Credentials not required.

**GET /api/users**

If user credentials are valid:
* Returns status 200
* Response body returns the user record. 

**POST /api/users**

The following validations are done to the request body
* firstName, lastName, emailAddress, password fields are present and not null
* emailAddress is a valid email format
* emailAddress is not already on another user record

If the request body passes validation:
* A user record is created
* Status 201 is returned
* Response header Location is set to "/". 
* Response body returns no content. 
* Credentials not required.

# Extra Credit
On the POST /api/users route the additional validations are done on the email address
* it is a valid email format
* it is not already on another user record


# Project Structure

## Primary packages

* sqlite: database
* sequelize: database ORM
* express: route handler

## File structure

* config: sequelize database connection parameters
* migrations: not used
* models: sequelize models for database tables
* node_modules: external packages (ex: sequelize, sqlite )
* routes: code for URLs
* seed: database creation and populating scripts
* seeders: not used
* support: internal support functions, such as authenticateUser
* app.js: main script
* nodemon.json: node configuration
* package-lock.json: npm package configuration
* package.json: npm package configuration
* README.md - this file
* RESTAPI.postman_collection.json: Postman test scripts
* sequelize-cli: sequelize CLI commands used during development


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
