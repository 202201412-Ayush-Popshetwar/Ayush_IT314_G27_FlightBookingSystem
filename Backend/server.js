import app from './index.js';

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Connected to Backend on port ${PORT}`);
});
