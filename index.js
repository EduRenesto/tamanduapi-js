const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

let app = express();

let port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(morgan('tiny'));

const ru = require('./routes/ru.js');
app.use('/ru', ru);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
