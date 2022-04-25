const express = require('express');
const mongoose = require('mongoose');

const boulders = require(__dirname + '/routes/boulders');
const walls = require(__dirname + '/routes/walls');

mongoose.connect(
    'mongodb://localhost:27017/blocarc',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

let app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));
app.use('/boulders', boulders);
app.use('/walls', walls);
app.use('/img/boulders', express.static('./public/img/boulders'));

app.listen(8080);