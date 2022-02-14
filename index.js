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
  const poolQuery = `INSERT INTO rectangle (name, color, width, height) VALUES ('${name}', '${color}', '${width}', '${height}')`;

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
    const poolQuery = `UPDATE rectangle SET (name, color, width, height) = ('${name}', '${color}', '${width}','${height}') WHERE id='${id}'`;
  
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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

/* 
  - what happens when the user submits add rectangle with no/partial inputs?
  - what happens when the user submits update rectangle with no/partial inputs?

  need to do layout and styling
  need to add additional creative attributes to the table that the user can edit
  - isRounded (bool)
  - border color (char)
  - showShadow (bool)
  - ...

  look into SSL stuff with Heroku and Postgres

  question: can the UI look anyway we want? does it need to follow the look that is on canvas?
*/