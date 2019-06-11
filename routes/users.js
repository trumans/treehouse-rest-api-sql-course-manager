var express = require('express');
var router = express.Router();
var User = require("../models").User;
var authenticateUser = require("../support/authenticateUser");

router.get('/', authenticateUser, (req, res) => {
	let user = req.currentUser;
	res.json( { user } );
});

module.exports = router;