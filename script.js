
import mysql from 'mysql2';
import express from 'express'
import dotenv from 'dotenv';

dotenv.config();
var nodeEnv = process.env.NODE_ENV;

var app = express();
// Set up connection to database.
var connection = mysql.createConnection(process.env.DATABASE_URL);

// Connect to database.
connection.connect((err) => {
  if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
  }
  console.log('Connected as ID ' + connection.threadId);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Listen to POST requests to /contacts.
// app.post('/contacts', function(req, res) {
//   // Sent data.
//   // var Name = req.body.Name;
//   // var Email = req.body.Email;
//   // Do a MySQL query.
//   const { Name, Email } = req.body;
//   var query = connection.query('INSERT INTO contacts (Name, Email) VALUES (?,?)', [Name,Email], function(err, result) {
//   });
//   res.end('Success');
// });

app.post('/contacts', (req, res) => {
  const { Name, Email } = req.body;
  connection.query('INSERT INTO contacts (Name, Email) VALUES (?, ?)', [Name, Email], (err, result) => {
      if (err) {
          console.error('Error when inserting contact: ' + err.message);
          res.status(500).send('Error when inserting contact: ' + err.message);
          return;
      }

      res.status(201).json({ message: 'Successfully entered contact!' });
  });
});

app.get('/contacts', (req, res) => {
  const query = 'SELECT * FROM contacts';

  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving contacts: ' + err.stack);
          res.status(500).send('Error retrieving contacts');
          return;
      }

      res.json(results);
  });
});

// simple query
// connection.query(
//   'SELECT id FROM contacts',
//   (err, results, fields) => {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});