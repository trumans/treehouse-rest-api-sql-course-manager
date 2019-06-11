const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require("../models").User; 
const authenticateUser = require("../support/authenticateUser");

router.get('/', authenticateUser, (req, res) => {
	let currentUser = req.currentUser;
	res.json( { currentUser } );
});

router.post('/', (req, res) => {
	let newUser = req.body;
	User
		.create({
			firstName: newUser.firstName,
			lastName:  newUser.lastName,
			emailAddress: newUser.emailAddress,
			password:  bcryptjs.hashSync(newUser.password)
		})
		.then(() => {
			res.location('/').status(201).end();
		});
});

module.exports = router;