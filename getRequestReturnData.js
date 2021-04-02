const http = require('http');
const https = require('https');
const StatusCodeMovedPermanently = 301;

module.exports.getJSON = (options, onResult) => {

    let port = options.protocolType == "https" ? https : http;
  
    let output = '';
  
    const req = port.request(options, (res) => {
      console.log(`${options.host} : ${res.statusCode} : ${res.headers.location}`);
      if (res.statusCode == StatusCodeMovedPermanently)
      {
        onResult(res.statusCode, res.headers.location);
        return;
      }
      res.setEncoding('utf8');
  
      res.on('data', (chunk) => {
        output += chunk;
      });
  
      res.on('end', () => {
        
        let obj = JSON.parse(output);
  
        onResult(res.statusCode, obj);
      });
    });
  
    req.on('error', (err) => {
      console.log('error: ' + err.message);
      res.send('error: ' + err.message);
    });
  
    req.end();
  };

  