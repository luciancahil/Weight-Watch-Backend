//npm install express mysql cors node-forge'
//dummy, dummy1

const express = require('express');
const cors = require('cors');
const app = express();
const {PORT = 3000} = process.env

app.use(cors());

app.get('/', (req, res) => {
  res.send('Login Page')
});


app.listen(PORT, () => {
  console.log('Server Loaded on port ${PORT}');
})