//npm install express mysql cors node-forge'
//dummy, dummy1

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 443
const mysql = require('mysql');
const data = require("./Login.json");
const forge = require('node-forge');

app.use(cors());


var con = mysql.createConnection({
  host: data.host,
  user: data.user,
  password: data.password,
  database: "weightTrack"
});

app.get('/', (req, res) =>{
  res.end("got to /login for login info")
})

app.get('/login', (req, res) => {
  const{username, password} = req.query;

  console.log(username, password);

  //Checks if a username exists
  isValidUsername(username).then(function(result){
    if(result[0].numUN == 0){
      res.end("Unfound");
    }
  })
  
  //checks if password hashed matches the hash stored
  getSaltandHash(username).then(function(result){
    let hashSalt = result[0].salt;                        //salt stored in table
    let saltedPassword = password + hashSalt;             //user entered password with salt appended

    let saltedHsh = result[0].passhash;                   //password hash stored in table

    console.log(saltedHsh)

    //Runs the salted entered password through sha256
    var md = forge.md.sha256.create();
    md.update(saltedPassword);
    let inputSaltedHash = md.digest().toHex()           //The hash of the salt appeneded to the password the user just entered


    //checks to see if the hash of the entered password matches the stored hash 
    if(saltedHsh == inputSaltedHash){
      res.end("Granted")
    }else{
      res.end("Denied");
    }
  })
});


//checks if the username is one we have in the database
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