const express = require("express");
const { bot } = require("./bot");
require("dotenv").config()

const app = express();

app.get("/", (req, res) => {
  res.send("why hello there");
});

app.get("/get", (req,res)=>{
    await bot();
    res.send("Done")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`Listening on port ${PORT}`)

})


