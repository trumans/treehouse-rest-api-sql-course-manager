var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');

const { authenticateUser, findUserByEmail, findUserById } = require("../support/utils");

var Course = require("../models").Course;
var User = require("../models").User;

// Return all courses
router.get('/', (req, res) => {
	Course
		.findAll( { 
			include: [ { model: User } ] 
		})
		.then((courses) => {
			res.json( { courses } );
		});
});

// Return a single course
router.get('/:id', (req, res) => {
	Course
		.findAll( {
			where: { id: req.params.id }, 
			include: [ { model: User } ] 
		})
		.then((course) => {
			res.json( { course } );
		});
});

// Create a new course
router.post('/', authenticateUser,
	[ check('userId')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('userId is required')
		.isInt()
		.withMessage('userId must be an integer'),

	  check('title')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('title is required'),

	  check('description')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('description is required')
	],
	(req, res) => {
		const errorMsgs = validationResult(req).array().map(e => e.msg);
		const newCourse = req.body;

		findUserById(newCourse.userId)
			.then((owner) => {
				if (!owner) {
					errorMsgs.push('userId must be for an existing user')
				}

				if (!errorMsgs.length) {
					Course
						.create({
							userId: parseInt(newCourse.userId),
							title:  newCourse.title,
							description: newCourse.description,
							estimatedTime: newCourse.estimatedTime,
							materialsNeeded:  newCourse.materialsNeeded
						})
						.then((course) => {
							res.location(`/${course.id}`).status(201).end();
						});
				} else {
					res.status(400).json({ errors: errorMsgs });
				}
			});

});
module.exports = router;