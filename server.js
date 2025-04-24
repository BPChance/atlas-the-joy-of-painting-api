const app = require('./src/app');
const port = process.env.PORT || 3000;

// start the server
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
