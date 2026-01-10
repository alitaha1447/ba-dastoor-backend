const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');

const { createTeam, getTeam } = require('./teamControllers')

router.post('/create-team', upload.single('teamImage'), createTeam);
router.get('/get-team', getTeam);

module.exports = router;