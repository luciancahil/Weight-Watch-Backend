//npm install express mysql cors node-forge'
//dummy, dummy1

const express = require('express');
const cors = require('cors');
const app = express();
const {PORT = 3000} = process.env
const mysql = require('mysql');
var data = require("./Login.json");

app.use(cors());
var SQLResults;


var con = mysql.createConnection({
  host: data.host,
  user: data.user,
  password: data.password,
  database: "weightTrack"
});


//sets SQL results to be the entire contents of the SQL Table
con.connect(function(err) {

  if (err) throw err;
  con.query("SELECT * FROM userInfo", function (err, result, fields) {
    if (err) throw err;
    SQLResults = result;
  });
});

app.get('/login', (req, res) => {
  const{username, password} = req.query;
  console.log(username, password);

  //Checks if a username exists
  isValidUsername(username).then(function(result){
    console.log(result[0].numUN);
    if(result[0].numUN == 0){
      res.send("No Username");
    }
  })
  

  con.query("SELECT * FROM userInfo", (err, result) => {
    if(err){
      return res.send(err)
    }else{
      return res.send(result[0])
    }
  })
});

function isValidUsername(uname){
  return new Promise(function(resolve, reject){
  let sqlQ = "SELECT COUNT(*) AS numUN FROM userInfo WHERE username = '" + uname + "'";
    con.query(sqlQ, (err, result) => {
      if(err){
        return reject(err);
      }else{
        
        resolve(result);   //result[0].numUN
      }
    })
  })
}


app.listen(PORT, () => {
  console.log('Server Loaded on port ${PORT}');
})