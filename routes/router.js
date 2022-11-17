require('colors');
// const { Router } = require("express"); //1
// const router = Router(); //1
const express = require("express"); //2
const router = express.Router(); //2

const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const { lineBreak } = require("./../service");

//------------------------------------------------------------
const userPath = path.join(__dirname, "/../db/users.json");
lineBreak();
console.log("userPath:".bgBlue.yellow, userPath.blue);
lineBreak();

//!* ------------------------------------------------ ФУНЦИИ-ВЫЗЫВАЛКИ ------------------------------------------------
//todo   ------  1. Получение списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ ------
const getUsersList = async (showListAllUsers = 1) => {
    const users = JSON.parse(await fs.readFile(userPath, 'utf8'));
    // console.log("users:".bgCyan, users); //!
    // lineBreak();
    if (showListAllUsers === 1) {
        // console.log("a:", a); //!
        console.log("СПИСОК ВСЕХ ПОЛЬЗОВАТЕЛЕЙ:".bgGreen.black)
    };
    console.table(users);
    lineBreak();
    return users
};


//todo   ------  2. Создание НОВОГО списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ ------
const writeUsers = async (users) => {
    await fs.writeFile(userPath, JSON.stringify(users), 'utf8');
    // const allUsers = await fs.readFile(userPath, 'utf8'); //? - Читаем файл contacts.json
    if (users.length !== 0) {
        console.log("СПИСОК НОВЫХ ПОЛЬЗОВАТЕЛЕЙ:".bgCyan.red); //!+++
        await getUsersList(0)
    };
    // console.log("СПИСОК НОВЫХ ПОЛЬЗОВАТЕЛЕЙ:".bgGreen.magenta); //!+++
    // await getUsersList(0);
    // console.table(allUsers);
    // lineBreak();
    return users;

    // return await fs.writeFile(userPath, JSON.stringify(users));
};
//* ____________________________________________________________________________________________________________________

//! 0. Тестовый ЭНДПОИНТ
router.get("/test", (req, res) => {
    console.log("START".bgWhite.black); //!
    lineBreak();
    const test = {
        message1: "Hello my dear friend!",
        message2: "This is test PAGE",
        status: "GET "
    };
    console.log("Это ТЕСТОВАЯ СТРАНИЦА".bgYellow.black); //!
    console.table([test]); //!
    lineBreak();
    console.log("END".bgWhite.black); //!

    // res.send("GET request");
    res.json(test);
});


//! 1. Получение списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
router.get("/users", async (req, res) => {
    try {
        console.log("START".green); //!
        const users = await getUsersList();
        console.log("END".green); //!

        // res.status(200).json(users);
        res.redirect("/test");

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});


//! 2. Получение ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.get("/users/:id", async (req, res) => {
    try {
        console.log("START".blue); //!
        const id = req.params.id;
        const users = await getUsersList();
        // const user = users.find(user => String(user.id) === id); //? - это ОБЪЕКТ
        const user = users.filter(user => String(user.id) === id); //* - это МАССИВ с одним ОБЪЕКТОМ

        if (!user || user.length === 0) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END".blue); //!
            return res.status(404).json({ message: "User was not found" });
        };
        console.log(`ПОЛЬЗОВАТЕЛЬ с ID: ${id}:`.bgBlue.yellow); //!+++
        console.table(user); //!+++
        console.log("END".blue); //!

        res.status(200).json(user[0]); //? - это УЖЕ ОБЪЕКТ

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//! 3. Создание НОВОГО ПОЛЬЗОВАТЕЛЯ
router.post("/users", async (req, res) => {
    try {
        console.log("START".yellow); //!
        const body = req.body; //! в index1.js ==> app.use(express.json());
        const users = await getUsersList();
        const user = { id: randomUUID(), ...body };
        console.log(`НОВЫЙ ПОЛЬЗОВАТЕЛЬ с ID: ${user.id}:`.bgYellow.blue); //!
        console.table([user]); //!

        users.push(user);
        await writeUsers(users);
        // console.log("users_ПОСЛЕ:", users); //!

        console.log("END".yellow); //!

        res.status(201).json({ user })

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});


//! 4. Обновление ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.put("/users/:id", async (req, res) => {
    try {
        console.log("START".rainbow); //!
        const id = req.params.id;
        const body = req.body; //! в index1.js ==> app.use(express.json());
        const users = await getUsersList();
        const index = users.findIndex(user => String(user.id) === id);

        if (index === -1) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END".rainbow); //!
            return res.status(404).json({ message: "User was not found" });
        };

        const user = { ...users[index], ...body };
        users.splice(index, 1, user);
        // console.log("users_ПОСЛЕ:", users); //!

        console.log(`ОБНОВЛЕННЫЙ ПОЛЬЗОВАТЕЛЬ с ID: ${id}:`.rainbow); //!
        console.table([user]); //!

        await writeUsers(users);

        console.log("END".rainbow); //!

        res.status(200).json(user)

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});


//! 5. Удаление ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.delete("/users/:id", async (req, res) => {
    try {
        console.log("START".red); //!
        const id = req.params.id;
        const users = await getUsersList();
        const deletedUser = users.filter(user => String(user.id) === String(id)); //* - это МАССИВ с одним ОБЪЕКТОМ удаленного User
        const filteredUsers = users.filter(user => String(user.id) !== String(id)); //* - это МАССИВ ОБЪЕКТОB НОВЫХ ПОЛЬЗОВАТЕЛЕЙ

        if (filteredUsers.length === users.length) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END".red);
            return res.status(404).json({ message: "User was not found" });
        };
        console.log(`Этот ПОЛЬЗОВАТЕЛЬ УДАЛЕН ID: ${id}:`.bgRed.yellow); //!
        console.table(deletedUser); //!
        await writeUsers(filteredUsers);
        console.log("END".red); //!

        // res.status(200).json({ message: "User was remove" });
        res.status(200).json({ message: "User was remove:", ...deletedUser[0] });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//! 6. Удаление ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
router.delete("/users", async (req, res) => {
    try {
        console.log("START".bgRed.yellow); //!
        lineBreak();
        console.log("ВСЕ ПОЛЬЗОВАТЕЛИ УДАЛЕНЫ...".bgRed.white); //!
        await writeUsers([]);
        lineBreak();
        console.log("END".bgRed.yellow); //!

        res.status(200).json({ message: "ALL Users were remove..." });


    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



module.exports = router