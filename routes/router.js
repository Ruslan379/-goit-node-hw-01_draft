require('colors');
const { Router } = require("express");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");


const { lineBreak } = require("./../service");

//------------------------------------------------------------
const router = Router();

const userPath = path.join(__dirname, "/../db/users.json");
console.log("userPath:".bgBlue.yellow, userPath.blue);
lineBreak();

//!* ------------------------------------------------ ФУНЦИИ-ВЫЗЫВАЛКИ ------------------------------------------------
//todo   ------  1. Получение списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ ------
const getUsersList = async (a = 0) => {
    const users = JSON.parse(await fs.readFile(userPath, 'utf8'));
    // console.log("users:".bgCyan, users); //!
    // lineBreak();
    if (a === 0) {
        // console.log("a:", a); //!
        console.log("СПИСОК ВСЕХ ПОЛЬЗОВАТЕЛЕЙ:".bgCyan.red)
    };
    console.table(users);
    lineBreak();
    return users
};


//todo   ------  2. Создание НОВОГО списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ ------
const writeUsers = async (users) => {
    await fs.writeFile(userPath, JSON.stringify(users), 'utf8');
    // const allUsers = await fs.readFile(userPath, 'utf8'); //? - Читаем файл contacts.json
    console.log("СПИСОК НОВЫХ ПОЛЬЗОВАТЕЛЕЙ:".bgGreen.magenta); //!+++
    await getUsersList(1)
    // console.table(allUsers);
    // lineBreak();
    return users;

    // return await fs.writeFile(userPath, JSON.stringify(users));
};
//* ____________________________________________________________________________________________________________________

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
        const users = await getUsersList();
        res.status(200).json(users)

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

//! 2. Получение ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const users = await getUsersList();
        // const user = users.find(user => String(user.id) === id); //? - это ОБЪЕКТ
        const user = users.filter(user => String(user.id) === id); //* - это МАССИВ с одним ОБЪЕКТОМ

        if (!user || user.length === 0) {
            console.log("Нет контакта с таким ID:".yellow, id.red); //!
            lineBreak();
            return res.status(404).json({ message: "User was not found" });
        };
        console.log(`КОНТАКТ №_${id}:`.bgYellow.blue); //!+++
        console.table(user); //!+++
        res.status(200).json(user);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//! 3. Создание НОВОГО ПОЛЬЗОВАТЕЛЯ
router.post("/users", async (req, res) => {
    try {
        const body = req.body; //! в index1.js ==> app.use(express.json());
        const users = await getUsersList();
        const user = { id: randomUUID(), ...body };
        console.log(`НОВЫЙ КОНТАКТ №_${user.id}:`.bgMagenta.green); //!
        console.table([user]); //!

        users.push(user);
        await writeUsers(users);
        // console.log("users_ПОСЛЕ:", users); //!


        res.status(201).json({ user })

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

//! 4. Обновление ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.post("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const users = await getUsersList();
        const index = users.findIndex(user => String(user.id) === id);

        if (index === -1) {
            console.log("Нет контакта с таким ID:".yellow, id.red); //!
            lineBreak();
            return res.status(404).json({ message: "User was not found" });
        };


        res.status(201).json({ user })

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});








module.exports = router