var express = require('express');
var router = express.Router();
var Course = require("../models").Course;

router.get('/', (req, res) => {
  res.json({
    message: 'At the api/courses GET'
  });
});

module.exports = router;