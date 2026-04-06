import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running at the PORT http://localhost:${PORT}`);
});
