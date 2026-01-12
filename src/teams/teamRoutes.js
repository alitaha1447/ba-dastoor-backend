const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');

const { createTeam, getTeam, updateTeam } = require('./teamControllers')

router.post('/create-team', upload.single('teamImage'), createTeam);
router.get('/get-team', getTeam);
router.put('/edit-team', upload.single('teamImage'), updateTeam);

module.exports = router;