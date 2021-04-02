const express = require("express");
const app = express();
const cors = require('cors');
const getRequestReturnData = require("./getRequestReturnData");

const StatusCodeMovedPermanently = 301;
const urlBase = 'http://covidtracking.com/api/';
const urlBaseCharts = "https://covid19.richdataservices.com/"
const urlBaseCovid19 = "https://api.covid19api.com/"
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

    // options.host = "covid19.richdataservices.com";
    options.host = "api.covid19api.com";
    // options.path = `${urlBaseCharts}rds/api/query/int/jhu_country/select?cols=date_stamp,cnt_confirmed,cnt_death,cnt_recovered&where=(iso3166_1=US)&format=amcharts&limit=5000`;
    options.path = `${urlBaseCovid19}total/country/usa?from=2021-03-01&to=2021-04-02&to=2021-04-02`;
   
    options.protocolType = "https";
    
        // https://api.covid19api.com/total/country/usa?from=2021-03-01

    // https://covid19.richdataservices.com/rds/api/query/int/jhu_country/select?cols=date_stamp,cnt_confirmed,cnt_death,cnt_recovered&where=(iso3166_1=US)&format=amcharts&limit=5000
    getDataFromAPI (request, response, options);
});
// app.get("/newcasesbystates", function(request, response){
//     options.host = "public.tableau.com";
//     options.path = "https://public.tableau.com/views/CTPWebsiteGallery/1BM_Cases?language=en&display_count=y&origin=viz_share_link&embed=y&showVizHome=n&apiID=host0#navType=0&navSrc=Pars";
//     getDataFromAPI (request, response, options);
// });

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

