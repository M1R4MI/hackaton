const express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "me",
    password: "mainRoot",
    database: "linksDb"
});

connection.connect(err =>{
    if(err){
        console.error('Error connecting to db' + err.stack);
        return;
    }
    console.log('Connected to db as id: ' + connection.threadId);
});


connection.query(`CREATE TABLE IF NOT EXISTS Links (
    ID INT PRIMARY KEY,
    originalLink varchar(255) NOT NULL,
    newLink varchar(255) NOT NULL,
    counterForItem INT DEFAULT 0
);`, (err, results, fields) =>{
if(err) throw err;
console.log(results);
console.log(fields);
});

const app = express();

app.use(express.urlencoded({ extended: false }));


//for redirection from short link to long
app.get('/:mini', (req, res, next) => {
   res.send(req.params);
});

//generate short link
app.get('/', (req, res) =>{
    req.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link shortener</title>
        </head>
        <body>
            <h2>Link shortener</h2>
            <form id="dataForm">
                <label for="url">Enter Data:</label><br>
                <input type="text" id="url" name="url"><br><br>
                <br>
                <br>
                <button type ="submit">Submit</button>
            </form>
            
            <h2>Shortened url</h2>
            <textarea id="displayArea" rows="4" cols="50" readonly></textarea>
        
        </body>
        </html>`
    );
});
app.post('/', (req, res) =>{
    console.log(req.body);
    const url = req.body.url;
    connection.query('INSERT INTO Links (originalLink) VALUES (?);', [url], (error, result)=>{
        if(error) throw error;
        res.status(201).send('Student added successfully!');
    });
});

const PORT = process.env.PORT || 3015
app.listen(PORT, () =>{
   console.log(`Server running on port: ${PORT}`); 
});