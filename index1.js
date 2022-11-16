require('colors');
const express = require("express");
const morgan = require('morgan');

const router = require("./routes/router");
const { lineBreak } = require("./service");

//----------------------------------------------------------------
const PORT = 3000;
const app = express();
app.use(morgan('tiny'));
app.use(express.json());

// app.get("/test", (req, res) => {
//     res.json({ message: "Hello my dear friend!" });
// });

// app.use(router);
app.use("/api", router);


app.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`.bgGreen.red);
    lineBreak();
});
