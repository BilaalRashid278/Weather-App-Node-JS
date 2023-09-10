const http = require('http');
const fs = require('fs');
const dotenv = require('dotenv');


dotenv.config({path:'./config.env'});
const HomeFile = fs.readFileSync('./index.html', 'utf-8');
const ReplaceVal = (tempfile,orgval) => {
    let temprature = tempfile.replace("{%City%}",orgval.location.name);
    temprature = temprature.replace("{%Contry%}",orgval.location.country);
    temprature = temprature.replace("{%tempval%}",orgval.current.temp_c);
    temprature = temprature.replace("{%Latitudeval%}",orgval.location.lat);
    temprature = temprature.replace("{%Longitudeval%}",orgval.location.lon);
    temprature = temprature.replace("{%WeatherCondition%}",orgval.current.condition.text);
    return temprature;
};
const server = http.createServer(async (req, res) => {
    if (req.url == '/') {
        const requests = require('requests');
        requests(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=Lahore&aqi=no`).on("data",(chunck)=>{
            const JsonData = JSON.parse(chunck);
            const arrObj = [JsonData];
            const realData = arrObj.map(val=>ReplaceVal(HomeFile, val)).toString();
            res.write(realData);
        }).on("end",(error)=>{
            console.log(error);
            res.end();
        })
    } else {
        res.writeHead(404, { "content-type": "application/html" });
        res.end();
    }
});


server.listen(process.env.PORT, 'localhost', () => {
    console.log("Server is Starting");
})