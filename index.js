require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

// Database
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // fix SSL error?

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes

app.get('/', (req, res) => {
  console.log('[GET]:', '/');
  res.send('Welcome to the server!');
});

app.get('/rectangles', (req, res) => {
  console.log('[GET]:', '/rectangles');

  const poolQuery = 'SELECT * FROM rectangle';

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);
  
    const rows = result.rows;

    res.render('pages/index', { rows });
  });
});

app.post('/rectangles', (req, res) => {
  console.log('[POST]:', '/rectangles');

  const {
    name,
    color,
    width,
    height,
  } = req.body;

  const poolQuery = `INSERT INTO rectangle (name, color, width, height) VALUES ('${name}', '${color}', '${width}', '${height}')`;

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);
    res.redirect('/rectangles');
  });
});

app.get('/rectangles/:id', (req, res) => { // handles reading, updating, and deleting
  console.log('[GET]:', '/rectangles/:id');

  const id = req.params.id;

  const poolQuery = `SELECT * FROM rectangle WHERE id='${id}'`;

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);

    const row = result.rows[0];

    res.render('pages/rectangle', { row });
  });
});

app.post('/rectangles/:id/update', (req, res) => {
  console.log('[GET]:', '/rectangles/:id/update');

  const id = req.params.id;

  const {
    name,
    color,
    width,
    height,
  } = req.body;

  const poolQuery = `UPDATE rectangle SET (name, color, width, height) = ('${name}', '${color}', '${width}','${height}') WHERE id='${id}'`;

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);
    res.redirect(`/rectangles/${id}`);
  });
});

app.get('/rectangles/:id/delete', (req, res) => {
  console.log('[GET]:', '/rectangles/:id/delete');

  const id = req.params.id;

  const poolQuery = `DELETE FROM rectangle WHERE id='${id}'`;

  pool.query(poolQuery, (err, result) => {
    if (err) console.log(err);
    res.redirect('/rectangles');
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

/* 
  need to do error handling

    - what happens when the user goes to a page that does not exist?

    - what happens when the user passes an id into the url that does not exist?

    - what happens when the user submits add rectangle with no/partial inputs?

    - what happens when the user submits update rectangle with no/partial inputs?

  need to do layout and styling
*/