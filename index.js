require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

// Database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Express
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/rectangles', (req, res) => {
  const poolQuery = 'SELECT * FROM rectangle';

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);
    else res.render('pages/rectangles', { rows: result.rows });
  });
});

app.post('/rectangles', (req, res) => {
  const { name, color, width, height } = req.body;

  const poolQuery = `INSERT INTO rectangle (name, color, width, height) VALUES ('${name}', '${color.toLowerCase()}', '${width}', '${height}')`;

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);
    else res.redirect('/rectangles');
  });
});

app.get('/rectangles/:id', (req, res) => {
  const id = req.params.id;

  if (!isNaN(id)) {
    const poolQuery = `SELECT * FROM rectangle WHERE id='${id}'`;

    pool.query(poolQuery, (err, result) => {
      if (err) console.log(err);
      else if (result.rows.length === 0) res.render('pages/error');
      else if (result.rows.length > 0) res.render('pages/rectangle', { row: result.rows[0] });
    });
  } else {
    res.render('pages/error');
  }
});

app.post('/rectangles/:id/update', (req, res) => {
  const id = req.params.id;

  if (!isNaN(id)) {
    const { name, color, width, height } = req.body;

    const poolQuery = `UPDATE rectangle SET (name, color, width, height) = ('${name}', '${color.toLowerCase()}', '${width}','${height}') WHERE id='${id}'`;
  
    pool.query(poolQuery, (err, result) => {
      if (err) console.log(err);
      else res.redirect(`/rectangles/${id}`);
    });
  } else {
    res.render('pages/error');
  }
});

app.get('/rectangles/:id/delete', (req, res) => {
  const id = req.params.id;

  if (!isNaN(id)) {
    const poolQuery = `DELETE FROM rectangle WHERE id='${id}'`;

    pool.query(poolQuery, (err, result) => {
      if (err) console.log(err);
      else res.redirect('/rectangles');
    });
  } else {
    res.render('pages/error');
  }
});

app.get('*', (req, res) => {
  res.render('pages/error');
});

// Listen
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

/*
  need to add additional creative attributes to the table that the user can edit
  - isRounded (bool)
  - border color (char)
  - showShadow (bool)
  - ...

  todo: look into SSL stuff with Heroku and Postgres
  todo: update canvas layout
  todo: display something on homepage
  todo: update layout to handle very long names
  todo: polish forms
  todo: fix back button where updating or deleting will push to history an additional url, I need to make it so that instead of redirecting i replace history instead, otherwise we will need to refetch docs and rerender the page
  todo: update colors to be a bit darker expecially the forms since laptop screen has a hard time showing these colors (compared to my desktop monitor)
  todo: heroku not working because of SSL - add environment variable to heroku app
*/