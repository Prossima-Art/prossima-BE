import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express'
import mysql from 'mysql2';

dotenv.config();

//app is an instance of express
var app = express();

//Specifying middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//Route Structure:
//app.METHOD(PATH, HANDLER), 
//where PATH is a path on the server and HANDLER is the function executed when the route is matched.
app.post('/contacts', (req, res) => {
  const { Name, Email } = req.body;
  // var Name = req.body.Name;
  // var Email = req.body.Email;
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

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});