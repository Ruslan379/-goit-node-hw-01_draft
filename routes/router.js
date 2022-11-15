require('colors');
const { Router } = require("express");
const fs = require("fs/promises");
const path = require("path");

const { lineBreak } = require("./../service");

//------------------------------------------------------------
const router = Router();

const userPath = path.join(__dirname, "/../db/users.json");
console.log("userPath:".bgBlue, userPath.blue);
lineBreak();


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
        const users = JSON.parse(await fs.readFile(userPath, 'utf8'));
        // console.log("users:".bgCyan, users); //!
        // lineBreak();
        console.log("СПИСОК ВСЕХ ПОЛЬЗОВАТЕЛЕЙ:".bgCyan); //!+++
        console.table(users);
        lineBreak();

    } catch (error) {

    }
});









module.exports = router