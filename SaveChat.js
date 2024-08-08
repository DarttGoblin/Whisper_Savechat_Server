const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 7001;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql7.freesqldatabase.com',
    user: 'sql7724126',
    password: 'V6PCDXyNdv',
    database: 'sql7724126'
});

app.post("/", (req, res) => {
    const messageObj = req.body.messageObj;

    console.log(messageObj.sender);
    console.log(messageObj.message);
    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection: ' + err.stack);
            res.status(500).json({ success: false, error: 'Error connecting to the database, ' + err.stack });
            return;
        }
        console.log('Connected to database with connection id ' + connection.threadId);

        const insertQuery = 'INSERT INTO conversation0(messageSender, messageContent) VALUES(?, ?)';
        connection.query(insertQuery, [messageObj.sender, messageObj.message], (error) => {
            connection.release();
            
            if (error) {
                console.log("Message hasn't been saved");
                console.error('Error ' + error.stack);
                res.status(500).json({ success: false, error: error.stack });
                return;
            }
            console.log('Message has been saved!');
            res.status(200).json({ success: true });
        });
    });
});

app.listen(port, () => console.log("Listening on port " + port));
