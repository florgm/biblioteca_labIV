const con = require('./libs/db_connection')
const express = require('express');
const session = require('express-session');
const mySQLsession = require ('express-mysql-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const HOUR = 1000 * 60 * 60

const app = express();

app.use(cors({
    origin:"http://localhost:8000",
    credentials: true
}));

var sessionStore = new mySQLsession({}, con);

app.use(session ({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    store: sessionStore,
    cookie: {
        maxAge: HOUR * 24,
        sameSite: true
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'applicationlication/json' }));

require('./routes/app.routes')(app);

var server = app.listen(5555, () => console.log('API listening on port 5555'));

// var server = app.listen(8080, '127.0.0.1', function () {
//     var host = server.address().address
//     var port = server.address().port
//     console.log("App listening at http://%s:%s", host, port)
// })