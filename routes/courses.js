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
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			include: [ {
				model: User,
				attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
			}]
		})
		.then((courses) => {
			res.json( { courses } );
		});
});

// Return a single course
router.get('/:id', (req, res) => {
	Course
		.findOne( {
			where: { id: req.params.id },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			include: [ {
				model: User,
				attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
			}]
		})
		.then((course) => {
			res.json( { course } );
		});
});

const validateCourseBody = 
	[ check('userId')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('userId is required'),

	  check('title')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('title is required'),

	  check('description')
		.exists( { checkNull: true, checkFalsy: true } )
		.withMessage('description is required')
	]

// Create a new course
router.post('/', authenticateUser, validateCourseBody,
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
							res.location(`/api/courses/${course.id}`).status(201).end();
						});
				} else {
					// otherwise return the validations errors
					res.status(400).json({ errors: errorMsgs });
				}
			});
});

// Update an existing course
router.put('/:id', authenticateUser, validateCourseBody,
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

// Delete a course
router.delete('/:id', authenticateUser,
	(req, res) => {
		const courseId = req.params.id;
		Course
			.findByPk(courseId)
			.then((course) => {
				if (course) {
					// validate the current user is the course owner
					if (req.currentUser.id != course.userId) {
						res.status(403).json( {
							errors: [ 'Current user may not delete this course' ]
						});
					} else {
							Course
								.destroy( { where: { id: courseId } })
								.then((course) => { res.status(204).end() });
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