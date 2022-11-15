require('colors');
const { Router } = require("express");
const fs = require("fs/promises");
const path = require("path");


const userPath = path.join(__dirname, "/../db/users.json");
console.log("userPath:".bgBlue, userPath.blue);

const router = Router();


//! 0. Тестовый ЭНДПОИНТ
router.get("/test", (req, res) => {
    res.json({
        message: "Hello my dear friend!",
        status: "GET "
    });
});

//! 1. Получение списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
router.get("/users", async (req, res) => {
    try {
        const users = await fs.readFile()
    } catch (error) {

    }
});









module.exports = router