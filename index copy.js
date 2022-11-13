// const Calc = require('calc-js').Calc;


// const { response } = require('express');
const http = require('http');
// const { request } = require('https');
const fs = require('fs').promises;
// const fs = require('fs'); //! Sync

const PORT = 8081;


// console.log(process.argv);
// console.log(new Calc(0.2).sum(0.1).finish());

// const [, , a, b] = process.argv
// const a = process.argv[2]
// const b = process.argv[3]
// console.log(new Calc(parseInt(a)).sum(parseInt(b)).finish());

// const path = require('path');
// console.log(path.resolve('dateUtils.js'));

// const fs = require('fs');

// fs.readFile('./data.txt', 'utf8', (error, data) => {
//     if (error) {
//         console.error(error);
//     }
//     console.log(data);
// })


// const { getCurrentDate } = require('./dateUtils');
// global.testData = 'rrr-123-789'
// console.log("global.testData:", global.testData);

// console.log(`Get current date function result: ${getCurrentDate()}`);

// console.log(process.env);
// console.log(process.argv);

// process.exit()
// console.log('Ne viden');


// console.log(__dirname);
// console.log(__filename);

//! +++++++++++++++++++
// let data = "пустая строка";

// (async () => {
//     try {
//         data = await fs.readFile('./resume.html', 'utf8');
//         // console.log(data); //!
//     } catch (error) {
//         console.log(error);
//     }
// })();

// const resume = fs.readFileSync('./resume.html', 'utf8'); //! Sync



const requestHandler = async (request, response) => {
    if (request.url.indexOf('/home') >= 0) {
        // response.writeHead(200, { 'Content-type': 'text/html' }); //! 1, 3
        response.writeHead(200, { 'Content-type': 'text/json' }); //! 2
        // response.end('<h1>GoIt-Hello!</h1>'); //! 1
        // response.end(JSON.stringify({ a: 1, b: [] })); //! 2
        return response.end('{"url": "home"}'); //! 2

    }
    const resume = await fs.readFile('./resume.html', 'utf8');
    response.writeHead(200, { 'Content-type': 'text/html' }); //! 1, 3
    // response.writeHead(200, { 'Content-type': 'text/json' }); //! 2
    // response.end('<h1>GoIt-Hello!</h1>'); //! 1
    // response.end(JSON.stringify({ a: 1, b: [] })); //! 2
    // return response.end(data); //! 3
    return response.end(resume); //! 3-1
}

const server = http.createServer(requestHandler);

server.listen(PORT, (err) => {
    if (err) {
        console.error('Error at a server launch:', err);
    }
    console.log(`Server works at port ${PORT}!`);
})