const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodes_controller');

router.get('/', episodeController.getEpisodes);

module.exports = router;
