const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const path = require('node:path');
// const Search_Value = require('../views/script');
const bodyParser = require('body-parser');

const app = express();
dotenv.config({path:'./config.env'});
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',(req,res) => {
    const requests = require('requests');
   try {
    requests(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${'Lahore'}&aqi=no`).on("data",(chunck)=>{
        const data = JSON.parse(chunck);
        res.render('index.hbs',{
            MyTemp : data.current.temp_c,
            MyLatitude :data.location.lat,
            MyLongitude : data.location.lat,
            WeatherCondition : data.current.condition.text,
            MyCountry : data.location.country,
            MyCity : data.location.name,
            WeatherImg : data.current.condition.icon
        });
        }).on("end",(error)=>{
            console.log(error);
        });
   } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
   }
});

app.get("*",(req,res)=>{
    res.status(404).send("404 Not Found");
})
app.listen(process.env.PORT, 'localhost', () => {
    console.log(`Server is Starting on http://localhost:${process.env.PORT}`);
})
