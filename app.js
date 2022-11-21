const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
require("colors");

const morgan = require("morgan");
const logger = require("morgan");
require("dotenv").config();
const moment = require('moment');

const contactsRouter = require("./routes/api/contacts");
const { lineBreak } = require("./service");

//----------------------------------------------------------------
const app = express();


//! Middleware - cors
app.use(cors());


//! Middleware - Парсер JSON
app.use(express.json());


//! Middleware - morgan/logger
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));
// app.use(logger('dev')); //?

// app.use(morgan('combined')); //* +++
// app.use(morgan('common ')); //* +++
// app.use(morgan('dev')); //! +++++
// app.use(morgan('short')); //* +++
// app.use(morgan('tiny')); //* +++


//! Middleware - TECTОВОЕ ПО
app.use((req, res, next) => {
    console.log('Middleware - Наше промежуточное TECTОВОЕ ПО'.bgYellow.green);
    lineBreak();
    next();
});


//! Middleware - Промежуточная обработка в пути для всех методов запросов - ?????
app.all('/anything', (req, res, next) => {
    console.log('Middleware - Anything method'.bgYellow.cyan);
    lineBreak();
    next(); // передаем управление дальше
});


//! Middleware - ведение логов всех запросов
app.use(async (req, res, next) => {
    const { method, url } = req;
    const date = moment().format("DD-MM-YYYY_hh:mm:ss");
    await fs.appendFile("./log/server. log", `\n${method}, ${url}, ${date}`)

    console.log('Middleware - ЛОГ запроса записан в файл server.txt:'.bgYellow.black);
    console.log(`${method}, ${url}, ${date}`.bgYellow.black);

    lineBreak();
    next();
});

//todo OLD
// app.get("/test", (req, res) => {
//     res.json({ message: "Hello my dear friend!" });
// });

//!!!!! ===== ГЛАВНЫЙ ОБРАБОТЧИК ВСЕХ ЗАПРОСОВ  ===== 
// app.use(contactsRouter);
app.use("/api/contacts", contactsRouter);


//! Middleware - если маршрут не найден (если нет такой страницы)
app.use((req, res) => {
    console.log('Middleware - Такой маршрут не найден...'.bgYellow.black);
    console.log('Middleware - Перенаправляю на "http://localhost:8082/api/contacts/test"'.bgYellow.black);
    res.redirect("http://localhost:8082/api/contacts/test");
    // res.status(404).json({ message: 'Route not found\n, redirect on "http://localhost:8082/api/contacts"' });

});


//! Middleware - обработка ошибки СЕРВЕРА
app.use((err, req, res, next) => {
    console.log("!!! ОШИБКА !!!:".bgRed.white);
    console.error(err.message.red);

    const { status = 500, message = "Server ERROR" } = err;
    res.status(status).json({ message: err.message });
});


//? Перенесен в server.js
// const PORT = 3000;
// const PORT = process.env.PORT;
// const PORT = process.env.PORT || 3000;
// const { PORT = 3000 } = process.env; //! +++++


//? Перенесен в server.js
// app.listen(PORT, (err) => {
//     if (err) console.error("Error at server launch", err.message);
//     console.log(`Server is running on the port: ${PORT}`.bgGreen.red);
//     lineBreak();
// });

module.exports = app;