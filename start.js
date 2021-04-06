//NAPI V4 File
const express = require('express')
const app = express()
const port = 8080

app.use('/', require('./index.js'));

app.use(function(req, res, next){
  res.status(404);
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(port, () => {
  console.log(new Date().toLocaleString()+' | NovaAPI | '+`Running on Port ${port}`)
})