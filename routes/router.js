const { Router } = require("express");

const router = Router();

router.get("/test", (req, res) => {
    res.json({ message: "Hello my dear friend!" });
});

module.exports = router