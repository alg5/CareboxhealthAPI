const express = require("express");
const app = express();
const cors = require('cors');
const getRequestReturnData = require("./getRequestReturnData");

const StatusCodeMovedPermanently = 301;
const urlBase = 'http://covidtracking.com/api/';
const urlBaseCovid19 = "https://api.covid19api.com/";
const urlBaseCoronaVirusStat = "https://corona-virus-stats.herokuapp.com/";

const http = require('http');
const https = require('https');


app.use(cors());
// app.listen(3000);

let options = {
    host: 'covidtracking.com',
    path: '',
    method: 'GET',
    protocolType: 'http',
    headers: {
      'Content-Type': 'application/json'
    }
    
  };

app.get("/", function(request, response){
  
    
    response.send("<h1>Welcome to the .....</h1>");
});

app.get("/summary", function(request, response){
     
    options.path = `${urlBase}us`;
    getDataFromAPI (request, response, options);
});

app.get("/statesinfo", function(request, response){
    options.path = `${urlBase}states/info`;
    getDataFromAPI (request, response, options);
   
});

app.get("/statescurrent", function(request, response){
    options.path = `${urlBase}states`;
    getDataFromAPI (request, response, options);
});

app.get("/summarychart", function(request, response){

    let dt =  new Date();
    
    // console.log("dt = " + dt);
    const to = dt.toISOString().split('T')[0];
    //sub 7 days
    dt.setDate(dt.getDate() -  7);
    const from = dt.toISOString().split('T')[0];
    console.log("from = " + from + 'to = ' + to);

    // options.host = "covid19.richdataservices.com";
    options.host = "api.covid19api.com";
    // options.path = `${urlBaseCharts}rds/api/query/int/jhu_country/select?cols=date_stamp,cnt_confirmed,cnt_death,cnt_recovered&where=(iso3166_1=US)&format=amcharts&limit=5000`;
    options.path = `${urlBaseCovid19}total/country/usa?from=${from}&to=${to}`;
    console.log("path = " + options.path);
    options.protocolType = "https";

    getDataFromAPI (request, response, options);
});


app.get("/totalworldchart", function(request, response){

 
    // options.host = "covid19.richdataservices.com";
    options.host = "corona-virus-stats.herokuapp.com";
    // options.path = `${urlBaseCharts}rds/api/query/int/jhu_country/select?cols=date_stamp,cnt_confirmed,cnt_death,cnt_recovered&where=(iso3166_1=US)&format=amcharts&limit=5000`;
    options.path = `${urlBaseCoronaVirusStat}api/v1/cases/general-stats`;

    // https://corona-virus-stats.herokuapp.com/api/v1/cases/general-stats
    // console.log("path = " + options.path);
    options.protocolType = "https";

    getDataFromAPI (request, response, options);
});



function getDataFromAPI(request, response, options){
    getRequestReturnData.getJSON(options, (statusCode, result) => {
        if (statusCode == StatusCodeMovedPermanently)
        {
            options.protocolType = result.indexOf("https") > -1 ? https : http ;
            options.path = result; 
            getDataFromAPIRedirect(request, response, options);
        }
        else
        {
            response.send(result);
        }
    });
};

function getDataFromAPIRedirect(request, response, options){
    getRequestReturnData.getJSON(options, (statusCode, result) => {
        response.send(result);
      });
};

app.listen(3000);
console.log("listen port 3000");

