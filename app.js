require("colors");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const router = require("./routes/router");
const { lineBreak } = require("./service");

//----------------------------------------------------------------
// const PORT = 3000;
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 3000;

const app = express();

// app.use(morgan('combined')); //* +++
// app.use(morgan('common ')); //* +++
app.use(morgan('dev')); //* +++++
// app.use(morgan('short')); //* +++
// app.use(morgan('tiny')); //* +++


// app.use(logger('dev')); //?

app.use(express.json()); //! Парсер JSON

//! Middleware
app.use((req, res, next) => {
    console.log('Middleware - Наше промежуточное ПО'.bgYellow.green);
    lineBreak();
    next();
});

//! Промежуточная обработка в пути для всех методов запросов
app.all('/anything', (req, res, next) => {
    console.log('Anything method.');
    next(); // передаем управление дальше
});

// app.get("/test", (req, res) => {
//     res.json({ message: "Hello my dear friend!" });
// });

// app.use(router);
app.use("/api", router);


app.listen(PORT, (err) => {
    if (err) console.error("Error at server launch", err.message);
    console.log(`Server is running on the port: ${PORT}`.bgGreen.red);
    lineBreak();
});
