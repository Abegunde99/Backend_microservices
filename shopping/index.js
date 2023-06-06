const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from shopping' });
});

app.listen(3002, () => {
    console.log('Shopping is listening on port 3002!');
});