'use strict';
const express = require('express');
const imageList = require('./imagelist');

const app = express();
const PORT = 6546;

app.use(express.static(`${__dirname}/static`));

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
  res.render('splash');
});

app.get('/v', (req, res) => {
  res.render('main');
});

app.get('/r', (req, res) => {
  res.render('main_remix');
});

app.get('/i', (req, res) => {
  imageList.random().then((file) => res.send(file));
});

app.listen(PORT, 'localhost', function () {
  console.log(`Bumble started on ${PORT}`);
});
