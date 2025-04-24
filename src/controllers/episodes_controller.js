const episodeService = require('../services/episodes_services');
const db = require('../db');

// controller for handling episode-related requests
const episodeController = {
  getEpisodes: async (req, res) => {
    try {
      const filters = {
        month: req.query.month,
        subjects: req.query.subjects,
        colors: req.query.colors,
        match: req.query.match,
      };
      // get filtered episodes`
      const query = await episodeService.getFilteredEpisodes(filters);
      const { rows } = await db.query(query.text, query.values);
      res.json(rows);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = episodeController;
