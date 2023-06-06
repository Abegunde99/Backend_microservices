const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from Products' });
});

app.listen(3001, () => {
    console.log('Products are listening on port 3001!');
});