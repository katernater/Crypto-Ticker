//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.render("index", {conversionRate: "", crypt: "bitcoin,ethereum,litecoin", curr: "USD"});
});


app.post("/", function(req, res){
  const cry = req.body.crypto;
  const fia = req.body.fiat;
  const amount = req.body.amount;
  var crypto = "";

  if(cry === "BTC"){
    crypto = "bitcoin";
  } else if (cry === "ETH"){
    crypto = "ethereum";
  } else{
    crypto = "litecoin";
  }

  const options = {
    url: " https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: cry,
      to: fia,
      amount: amount
    }
  };

  request(options, function(error,response,body){

    const data = JSON.parse(body);
    const price = data.price;
    const time = data.time;
    const result = amount + cry +" is currently valued at "+ price + fia;

    res.render("index", {conversionRate: result, curr: fia, crypt: crypto});
  });
});


app.listen(3000, function(){
  console.log("Server is running on port 3000!");
});

