const express = require("express");

const app = express();

app.get("/test", (req, res) => {
    res.json({ message: "Hello my friend!" });
});

app.listen(3000, () => console.log("Server is running on the port 3000!"));
