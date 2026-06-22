import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Lautan Uang berjalan di port ${PORT}`);
});