const express = require('express');
const app = express();
const cors = require('cors');
const proxy = require('express-http-proxy');

app.use(express.json());
app.use(cors());

app.use('/shopping', proxy('http://localhost:3002')); //shopping
app.use('/customer', proxy('http://localhost:3000')); //customer
app.use('/', proxy('http://localhost:3001')); //products


app.listen(3003, () => {
    console.log('Gateway listening on port 3003!');
});