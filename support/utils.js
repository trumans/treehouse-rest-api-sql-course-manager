const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;

/* 
	Retreive the user record based on the parameter email
	Returns a promise with the value of the user with the email or null
*/
const findUserByEmail = (email) => {
	return User.findOne({ where: { emailAddress: email || "" } })
}


/*
	Authenticate the user found in the HTTP Authorization header
		if authentication passes the function 
			- sets req.currentUser to user
			- calls next() to continue flow to next function 
		if authenticaiton fails function
			- console warning regarding the failure
			- returns HTTP Status 401 with the message "Access Denied"
*/
const authenticateUser = (req, res, next) => {

	function authFail(errorMsg) {
		console.warn(errorMsg);
		res.status(401).json({ message: "Access Denied" });
	}

	const credentials = auth(req);
	if (credentials) {
		findUserByEmail(credentials.name).then((user) => {
			if (user) {
				if (bcryptjs.compareSync(credentials.pass, user.password)) {
					req.currentUser = user;  // ??? return whole record ???
					next();
				} else {
					authFail(`Authentication failed for user '${credentials.name}'`);
				}
			} else {
				authFail(`Authentication failure: user '${credentials.name}' not found`);
			}
		})
	} else {
		authFail('Basic Auth expected in HTTP request'); 
	}
}

module.exports = { authenticateUser, findUserByEmail };