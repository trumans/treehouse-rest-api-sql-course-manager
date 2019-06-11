const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;
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

	//var authFail = null;
	const credentials = auth(req);
	if (credentials) {
		User
			.findAll({ where: { emailAddress: credentials.name } })
			.then(function(u) {
				if (u.length) {
					const user = u[0].dataValues;
					if (bcryptjs.compareSync(credentials.pass, user.password)) {
						req.currentUser = user;  // ??? return whole record ???
						next();
					} else {
						authFail(`Authentication failed for user '${credentials.name}'`);
					}
				} else {
					authFail(`Authentication failure: user '${credentials.name}' not found`);
				}
			});
	} else {
		authFail('Basic Auth expected in HTTP request'); 
	}
}

module.exports = authenticateUser;