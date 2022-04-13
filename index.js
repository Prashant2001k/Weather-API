const http=require("http");
const fs=require("fs");
var requests=require("requests");
const { setUncaughtExceptionCaptureCallback } = require("process");

const htmlFile=fs.readFileSync("index.html","utf-8");
// console.log(htmlFile);
var cloudes=(x)=>{
    if(x==0){
        return "sun";
    }else{
        return "clouds";
    }
}
const replaceVal=(tempval,orgval)=>{
    let temperature=tempval.replace("{%tempval%}",(orgval.main.temp-273).toFixed(2));
    temperature=temperature.replace("{%tempmin%}",(orgval.main.temp_min-273).toFixed(2));
    temperature=temperature.replace("{%tempmax%}",(orgval.main.temp_max-273).toFixed(2));
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%tempstatus%}",cloudes(orgval.clouds.all));
    return temperature;
};
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Jaipur&appid=7340ba9fc2bfd5232f8af57cf946e8d4')
        .on('data',(chunk) =>{
        const objdata=JSON.parse(chunk);
        const arrdata=[objdata];
        const realTimeData=arrdata.map((val) => replaceVal(htmlFile,val))
        .join("");  // for convert array to string
        res.write(realTimeData);
        console.log(realTimeData);
        })
        .on('end',(err) =>{
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }else{
        res.end("File not found");
    }
});

server.listen(8000,"127.0.0.1");