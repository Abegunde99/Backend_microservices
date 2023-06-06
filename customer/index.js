const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from Customers' });
});

app.listen(3000, () => {
    console.log('Customer listening on port 3000!');
});