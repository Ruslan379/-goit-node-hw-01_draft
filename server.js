const express = require('express');
const app = express();

const morgan = require('morgan');

const PORT = 8081;

// const { response } = require('express');
// const http = require('http');
// const { request } = require('https');
// const fs = require('fs').promises;
// const fs = require('fs'); //! Sync



//! +++++++++++++++++++

app.use(express.static('public'));
app.use(morgan('tiny'));

// app.use((request, response, next) => {
//     console.log(`${request.method}, ${request.originalUrl}, ${new Date().toISOString()}`);
//     next();
// });

app.get('/home', (request, response) => {
    // response.sendStatus(200);
    response.send("GET request")
});

app.post('/home', (request, response) => {
    response.send("POST request")
});

app.delete('/home', (request, response) => {
    response.send("DELETE request")
});

app.use((request, response) => {
    // response.send("USE-middleware request");
    // response.redirect('https://google.com');
    response.status(200).json({ javascript: 'json1234' });
});



app.listen(PORT, (err) => {
    if (err) {
        console.error('Error at a server launch:', err);
    }
    console.log(`Server works at port ${PORT}!`);
});





// const requestHandler = async (request, response) => {
//     if (request.url.indexOf('/home') >= 0) {
//         // response.writeHead(200, { 'Content-type': 'text/html' }); //! 1, 3
//         response.writeHead(200, { 'Content-type': 'text/json' }); //! 2
//         // response.end('<h1>GoIt-Hello!</h1>'); //! 1
//         // response.end(JSON.stringify({ a: 1, b: [] })); //! 2
//         return response.end('{"url": "home"}'); //! 2
//     }
//     const resume = await fs.readFile('./resume.html', 'utf8');
//     response.writeHead(200, { 'Content-type': 'text/html' }); //! 1, 3
//     // response.writeHead(200, { 'Content-type': 'text/json' }); //! 2
//     // response.end('<h1>GoIt-Hello!</h1>'); //! 1
//     // response.end(JSON.stringify({ a: 1, b: [] })); //! 2
//     // return response.end(data); //! 3
//     return response.end(resume); //! 3-1
// }



// const server = http.createServer(requestHandler);



// server.listen(PORT, (err) => {
//     if (err) {
//         console.error('Error at a server launch:', err);
//     }
//     console.log(`Server works at port ${PORT}!`);
// })