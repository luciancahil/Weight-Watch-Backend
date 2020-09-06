//npm install express mysql cors node-forge'
//dummy, dummy1

var mysql = require('mysql');
const data = require("./Login");
var sqlData;

var con = mysql.createConnection({
  host: data.host,
  user: data.user,
  password: data.password,
  database: "weightTrack"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM userInfo", function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].salt);
  });
});