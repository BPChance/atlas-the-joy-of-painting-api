const express = require('express');
const episodesRouter = require('./routes/episodes_routes');

const app = express();

// middleware
app.use(express.json());

app.use('/api/episodes', episodesRouter);

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something is broken' });
});

module.exports = app;
