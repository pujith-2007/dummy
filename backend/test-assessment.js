const http = require('http');

const data = JSON.stringify({
  track: 'React Developer',
  questionCount: 2
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/assessment/start',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log("Sending POST request to http://localhost:3000/api/assessment/start...");

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`\nStatus Code: ${res.statusCode}`);
    console.log('Response Body:\n');
    try {
        console.log(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
        console.log(body);
    }
  });
});

req.on('error', (error) => {
  console.error("Error:", error.message);
});

req.write(data);
req.end();
