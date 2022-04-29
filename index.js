const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();


// Middleware
app.use(express());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(port, (req, res) => {
    console.log('Listening to port', port);
});