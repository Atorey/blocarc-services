const express = require('express');
const mongoose = require('mongoose');

const boulders = require(__dirname + '/routes/boulders');

mongoose.connect(
    'mongodb://localhost:27017/blocarc',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

let app = express();

app.use(express.json());
app.use('/boulders', boulders);
app.use('/img/boulders', express.static('./public/img/boulders'));

app.listen(8080);