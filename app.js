const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
require("colors");

const morgan = require("morgan");
require("dotenv").config();
const moment = require('moment');

const contactsRouter = require("./routes/api/contacts");
const { lineBreak } = require("./service");

//----------------------------------------------------------------
const app = express();

app.use(cors());

// const PORT = 3000;
// const PORT = process.env.PORT;
// const PORT = process.env.PORT || 3000;
const { PORT = 3000 } = process.env;

app.use(express.json()); //! Парсер JSON

//! morgan
// app.use(morgan('combined')); //* +++
// app.use(morgan('common ')); //* +++
app.use(morgan('dev')); //* +++++
// app.use(morgan('short')); //* +++
// app.use(morgan('tiny')); //* +++

// app.use(logger('dev')); //?


//! Middleware
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


// app.get("/test", (req, res) => {
//     res.json({ message: "Hello my dear friend!" });
// });

// app.use(contactsRouter);
app.use("/api/contacts", contactsRouter);


app.listen(PORT, (err) => {
    if (err) console.error("Error at server launch", err.message);
    console.log(`Server is running on the port: ${PORT}`.bgGreen.red);
    lineBreak();
});
