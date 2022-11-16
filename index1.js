require('colors');
const express = require("express");

const router = require("./routes/router");
const { lineBreak } = require("./service");

//----------------------------------------------------------------
const PORT = 3000;
const server = express();
server.use(express.json());

// server.get("/test", (req, res) => {
//     res.json({ message: "Hello my dear friend!" });
// });

server.use(router)

server.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`.bgGreen.red);
    lineBreak();
});
