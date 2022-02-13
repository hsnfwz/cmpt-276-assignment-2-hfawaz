require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

// Database
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // fix SSL error

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  pool.query('SELECT * FROM rectangle', (err, result) => {
    if (err) console.log(err);

    console.log('[RESULT]:', result);
  
    const rows = result.rows;
  
    console.log('[ROWS]:', rows);

    res.render('pages/index', { rows });
  });
});

app.get('/:id', (req, res) => {
  const id = req.params.id

  pool.query(`SELECT * FROM rectangle WHERE id='${id}'`, (err, result) => {
    if (err) console.log(err);

    console.log('[RESULT]:', result);
  
    const row = result.rows[0];
  
    console.log('[ROWS]:', row);

    res.render(`pages/rectangle`, { row });
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
