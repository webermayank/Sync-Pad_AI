import app from './src/index.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});