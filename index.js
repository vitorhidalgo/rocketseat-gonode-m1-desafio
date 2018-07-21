const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

const middleware = (req, res, next) => {
  if (req.query.name === undefined || req.query.name === '') {
    res.redirect('/');
    return;
  }
  next();
};

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const people = {
    name: req.body.name,
    birth: req.body.birth,
  };

  const age = moment().diff(moment(req.body.birth, 'YYYY/MM/DD'), 'years');

  if (age > 18) {
    res.redirect(`/major?name=${people.name}`);
  } else {
    res.redirect(`/minor?name=${people.name}`);
  }
});

app.get('/major', middleware, (req, res) => {
  res.render('major', {
    name: req.query.name,
  });
});

app.get('/minor', middleware, (req, res) => {
  res.render('minor', {
    name: req.query.name,
  });
});

app.listen(3000);
