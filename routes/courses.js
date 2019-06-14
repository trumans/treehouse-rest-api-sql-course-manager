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
		.withMessage('userId is required'),

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

		// validate user id as an existing user
		findUserById(newCourse.userId)
			.then((owner) => {
				if (!owner) {
					errorMsgs.push('userId must be for an existing user')
				}

				if (!errorMsgs.length) {
					// create a new user if validations pass
					Course
						.create({
							userId: newCourse.userId,
							title:  newCourse.title,
							description: newCourse.description,
							estimatedTime: newCourse.estimatedTime,
							materialsNeeded:  newCourse.materialsNeeded
						})
						.then((course) => {
							res.location(`/${course.id}`).status(201).end();
						});
				} else {
					// otherwise return the validations errors
					res.status(400).json({ errors: errorMsgs });
				}
			});
});

// Update an existing course
router.put('/:id', authenticateUser, 
	[ check('title')
		.custom(title => (title == undefined || title != "") )
		.withMessage('title cannot be null'),

	  check('description')
		.custom(descr => (descr == undefined || descr != "") ) 
		.withMessage('description cannot be null')
	],
	(req, res) => {
		const newValues = req.body;
		const courseId = req.params.id;
		Course
			.findByPk(courseId)
			.then((course) => {
				if (course) {
					// validate the current user is the course owner
					if (req.currentUser.id != course.userId) {
						res.status(403).json( {
							errors: [ 'Current user may not update this course' ]
						});
					} else {
						const errorMsgs =
							validationResult(req).array().map(e => e.msg);

						if (!errorMsgs.length) {
							// silently ignore update to userId/owner
							delete newValues.userId
							// Update course if no validation errors
							Course
								.update(newValues, { where: { id: courseId } })
								.then((course) => { res.status(204).end() });
						} else {
							// fail due to body content validation errors
							res.status(400).json({ errors: errorMsgs });
						}
					}
				} else {
					// fail because URI is not a valid course
					res.status(400).json( {
						errors: [ `Course with id '${courseId}' not found` ]
					});
				}
	})
});

module.exports = router;