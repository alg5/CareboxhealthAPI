const express = require("express");
const app = express();
const cors = require('cors');
const getRequestReturnData = require("./getRequestReturnData");

const StatusCodeMovedPermanently = 301;
const urlBase = 'http://covidtracking.com/api/';
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

