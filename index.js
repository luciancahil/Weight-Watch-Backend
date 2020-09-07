//npm install express mysql cors node-forge'
//dummy, dummy1

const express = require('express');
const cors = require('cors');
const app = express();
const {PORT = 3000} = process.env
const mysql = require('mysql');
const data = require("./Login.json");
const forge = require('node-forge');

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
  //Checks if a username exists
  isValidUsername(username).then(function(result){
    if(result[0].numUN == 0){
      res.end("No Username");
    }
  })
  
  //checks if password hashed matches the hash stored
  getSaltandHash(username).then(function(result){
    let hashSalt = result[0].salt;                        //salt stored in table
    let saltedPassword = password + hashSalt;             //password with salt appended

    let saltedHsh = result[0].passhash;                   //password hash stored in table

    var md = forge.md.sha256.create();
    md.update(saltedPassword);
    let inputSaltedHash = md.digest().toHex()           //The hash of the salt appeneded to the password the user just entered

    if(saltedHsh == inputSaltedHash){
      res.end("Password Correct. Access Granted")
    }else{
      res.end("Password Incorrect. Access Denied");
    }
  })

  con.query("SELECT * FROM userInfo", (err, result) => {
    if(err){
      return res.end(err)
    }else{
      return res.end(result[0])
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

function getSaltandHash(uname){
  return new Promise(function(resolve, reject){
    let sqlQ = "SELECT salt, passhash FROM userInfo WHERE username = '" + uname + "'";
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