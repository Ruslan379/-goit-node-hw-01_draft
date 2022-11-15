require('colors');
const express = require("express");
const router = require("./routes/router");

const app = express();

// app.get("/test", (req, res) => {
//     res.json({ message: "Hello my dear friend!" });
// });

app.use(router)

app.listen(3000, () => console.log("Server is running on the port 3000!".bgGreen));
