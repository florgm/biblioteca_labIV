var mysql = require('mysql');

var con = mysql.createConnection({
    // host: "db",
    host: "localhost",
    user: "library",
    password: "library",
    database: "db_library"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});

module.exports = con;