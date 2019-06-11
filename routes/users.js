const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const { authenticateUser, findUserByEmail } = require("../support/utils");

const User = require("../models").User; 

router.get('/', authenticateUser, (req, res) => {
	let currentUser = req.currentUser;
	res.json( { currentUser } );
});

router.post('/',
	[ check('firstName')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('firstName is required'),

	  check('lastName')
	  	.exists( { checkNull: true, checkFalsy: true } )
	  	.withMessage('lastName is required'),

	  check('emailAddress')
	  	.exists( { checkNull: true, checkFalsy: true } )
	  	.withMessage('emailAddress is required')
	  	.isEmail()
		.withMessage("Email must be valid email format"),

	  check('password')
	  	.exists( { checkNull: true, checkFalsy: true } )
	  	.withMessage('password is required')
	],
	(req, res) => {
		const errorMsgs = validationResult(req).array().map(e => e.msg);
		const newUser = req.body;

		findUserByEmail(newUser.emailAddress)
			.then((existingUser) => {
				if (existingUser) { 
					errorMsgs.push("Email is used by another user"); 
				}
		
				if (!errorMsgs.length) {
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
				} else {
					res.status(400).json({ errors: errorMsgs });
				}
			})
});

module.exports = router;