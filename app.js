const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const luhn = require("js-luhn");

const { insertData, selectData } = require('./database/queries')

const hostname = '127.0.0.1';
const port = 3000;

const app =  express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));
 
app.get('/creditCards', async(req, res) =>{
  try {
    const card = await selectData();
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ error: "An error has occured while processing your request."})
  }
})

// validating and recording a new credit card entry
app.post('/creditCards', async (req, res) => {
  console.log("post request recieved: ", req.body)
  const { card_number, cvv, card_holder_name, expiration_date } = req.body;

  //verify card number
  if(!luhn(card_number)) {
    console.log("invalid card")
    res.status(400).send({ error: "Invalid credit card number" })
  } else if(cvv.length != 3) {
    console.log("invalid cvc")
    res.status(400).send({ error: "Invalid cvc number"})
  } else {
    try {
      const card = await insertData(card_number, cvv, card_holder_name, expiration_date);
      res.status(201).json(card);
    } catch (err) {
      res.status(500).json({ error: "An error has occured while processing your request."})
    }
  }

})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})
 
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
