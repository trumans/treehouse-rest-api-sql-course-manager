var express = require('express');
var router = express.Router();
var Course = require("../models").Course;
var User = require("../models").User;
const { authenticateUser, findUserByEmail } = require("../support/utils");

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
module.exports = router;