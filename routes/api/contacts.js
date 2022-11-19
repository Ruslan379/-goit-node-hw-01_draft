// const { Router } = require("express"); //1
// const router = Router(); //1
const express = require("express"); //2
const router = express.Router(); //2
const fs = require("fs/promises");
const path = require("path");
require('colors');

const Joi = require('joi');
const { randomUUID } = require("crypto");

// const { lineBreak } = require("../../service");
const { lineBreak } = require("../../service");

//------------------------------------------------------------
// const userPath = path.join(__dirname, "/../db/users.json");
// const userPath = path.join(__dirname, "/../../db/contacts2.json");
const userPath = path.join(__dirname, "/../../models/contacts.json");
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
    console.log("START-->GET/Test".bgWhite.black); //!
    lineBreak();
    const test = {
        message1: "Hello my dear friend!",
        message2: "This is test PAGE",
        status: "GET "
    };
    console.log("Это ТЕСТОВАЯ СТРАНИЦА".bgYellow.black); //!
    console.table([test]); //!
    lineBreak();
    console.log("END-->GET/Test".bgWhite.black); //!

    res.json(test);
    // res.send("GET request on the /test");
    // res.end("GET request-end on the /test");

});


//! 1. Получение списка ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
router.get("/", async (req, res) => {
    try {
        console.log("START-->GET/All".green); //!
        const users = await getUsersList();
        console.log("END-->GET/All".green); //!

        res.status(200).json(users);
        // res.redirect("/test"); //! Так УЖЕ НЕ РАБОТАЕТ!!!
        // res.redirect("http://localhost:8082/api/test");

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})


//! 2. Получение ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.get("/:id", async (req, res) => {
    try {
        console.log("START-->GET/:id".blue); //!
        // const id = req.params.id; //1
        const { id } = req.params; //2
        const users = await getUsersList();
        // const user = users.find(user => String(user.id) === id); //? - это ОБЪЕКТ
        // const user = users.filter(user => String(user.id) === id); //* - это МАССИВ с одним ОБЪЕКТОМ
        const [user] = users.filter(user => String(user.id) === id); //* - это УЖЕ ОБЪЕКТ

        // if (!user || user.length === 0) {
        if (!user) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END-->GET/:id".blue); //!
            return res.status(404).json({
                status: "error",
                code: 404,
                message: `User wiht id:'${id}' not found`
            });
        };
        console.log(`ПОЛЬЗОВАТЕЛЬ с ID: ${id}:`.bgBlue.yellow); //!+++
        // console.table(user); //!+++
        console.table([user]); //!+++
        console.log("END-->GET/:id".blue); //!

        // res.status(200).json(user[0]); //? - это УЖЕ ОБЪЕКТ из МАССИВА
        res.status(200).json(user); //? - это просто ОБЪЕКТ

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//! 3. Создание НОВОГО ПОЛЬЗОВАТЕЛЯ
router.post("/", async (req, res) => {
    try {
        console.log("START-->POST".yellow); //!
        lineBreak();
        //! ++++++++++++++ ВАЛИДАЦИЯ Joi +++++++++++++++++++++++++
        const schema = Joi.object({
            name: Joi.string()
                // .alphanum()
                .min(3)
                .max(30)
                .required(),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'org',] } })
                .required(),

            phone: Joi.string()
                // .alphanum()
                .min(5)
                .max(14)
                .required(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log("Ошибка ВАЛИДАЦИИ:".bgRed.black);
            console.log("");
            console.log(validationResult.error);
            lineBreak();
            console.log("END-->POST".yellow); //!
            return res.status(400).json({ status: validationResult.error.details });
        }
        //! ___________________ ВАЛИДАЦИЯ Joi ___________________

        const body = req.body; //! в index1.js ==> app.use(express.json());
        const { name, email, phone } = body;
        console.log("Эти поля прошли ВАЛИДАЦИЮ:".bgYellow.black);
        console.log("");
        console.log("name:".bgYellow.black, name.yellow); //!
        console.log("email:".bgYellow.black, email.yellow); //!
        console.log("phone:".bgYellow.black, phone.yellow); //!
        lineBreak();

        const users = await getUsersList();
        const user = { id: randomUUID().slice(-12), ...body };
        console.log(`НОВЫЙ ПОЛЬЗОВАТЕЛЬ с ID: ${user.id}:`.bgYellow.blue); //!
        console.table([user]); //!

        users.push(user);
        await writeUsers(users);
        // console.log("users_ПОСЛЕ:", users); //!

        console.log("END-->POST".yellow); //!

        res.status(201).json({
            status: "success",
            code: 201,
            data: {
                result: user
            }
        });

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});


//! 4-1. PUT-Обновление ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.put("/:id", async (req, res) => {
    try {
        console.log("START-->PUT/:id".rainbow); //!
        lineBreak();
        //! ++++++++++++++ ВАЛИДАЦИЯ Joi +++++++++++++++++++++++++
        const schema = Joi.object({
            name: Joi.string()
                // .alphanum()
                .min(3)
                .max(30)
                .required(),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'org',] } })
                .required(),

            phone: Joi.string()
                // .alphanum()
                .min(5)
                .max(14)
                .required(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log("Ошибка ВАЛИДАЦИИ:".bgRed.black);
            console.log("");
            console.log(validationResult.error);
            lineBreak();
            console.log("END-->PUT/:id".rainbow); //!
            return res.status(400).json({ status: validationResult.error.details });
        }
        //! ___________________ ВАЛИДАЦИЯ Joi ___________________

        // const id = req.params.id; //1
        const { id } = req.params; //2

        const body = req.body; //! в index1.js ==> app.use(express.json());
        const { name, email, phone } = body;
        console.log("Эти поля прошли ВАЛИДАЦИЮ:".bgYellow.black);
        console.log("");
        console.log("name:".bgYellow.black, name.yellow); //!
        console.log("email:".bgYellow.black, email.yellow); //!
        console.log("phone:".bgYellow.black, phone.yellow); //!
        lineBreak();

        const users = await getUsersList();
        const index = users.findIndex(user => String(user.id) === id);

        if (index === -1) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END-->PUT/:id".rainbow); //!
            return res.status(404).json({
                status: "error",
                code: 404,
                message: `User wiht id:'${id}' not found`
            });
        };

        //?-1  как правильно?
        // const user = { ...users[index], ...body }; 
        //?-2  как правильно?
        let user = null;
        if (isNaN(Number(id))) {
            // console.log("id:", id); 
            user = { id, ...body }
        } else {
            user = { id: Number(id), ...body };
        }

        users.splice(index, 1, user);
        // console.log("users_ПОСЛЕ:", users); //!

        console.log(`ОБНОВЛЕННЫЙ ПОЛЬЗОВАТЕЛЬ с ID: ${id}:`.rainbow); //!
        console.table([user]); //!

        await writeUsers(users);

        console.log("END-->PUT/:id".rainbow); //!

        res.status(200).json(user)

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});



//! 4-2. PATCH-Обновление ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.patch("/:id", async (req, res) => {
    try {
        console.log("START-->PATCH/:id".rainbow); //!
        lineBreak();
        //! ++++++++++++++ ВАЛИДАЦИЯ Joi +++++++++++++++++++++++++
        const schema = Joi.object({
            name: Joi.string()
                // .alphanum()
                .min(3)
                .max(30)
                .optional(),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'org',] } })
                .optional(),

            phone: Joi.string()
                // .alphanum()
                .min(5)
                .max(14)
                .optional(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log("Ошибка ВАЛИДАЦИИ:".bgRed.black);
            console.log("");
            console.log(validationResult.error);
            lineBreak();
            console.log("END-->PATCH/:id".rainbow); //!
            return res.status(400).json({ status: validationResult.error.details });
        }
        //! ___________________ ВАЛИДАЦИЯ Joi ___________________

        // const id = req.params.id; //1
        const { id } = req.params; //2

        const body = req.body; //! в index1.js ==> app.use(express.json());
        const { name, email, phone } = body;
        console.log("Эти поля прошли ВАЛИДАЦИЮ:".bgYellow.black);
        console.log("");
        if (name) console.log("name:".bgYellow.black, name.yellow); //!
        if (email) console.log("email:".bgYellow.black, email.yellow); //!
        if (phone) console.log("phone:".bgYellow.black, phone.yellow); //!
        lineBreak();
        console.log("Обновляем ТОЛЬКО ЭТИ поля:".bgGreen.red, body);
        lineBreak();

        const users = await getUsersList();
        const index = users.findIndex(user => String(user.id) === id);

        if (index === -1) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END-->PATCH/:id".rainbow); //!
            return res.status(404).json({
                status: "error",
                code: 404,
                message: `User wiht id:'${id}' not found`
            });
        };

        const user = { ...users[index], ...body };
        users.splice(index, 1, user);
        // console.log("users_ПОСЛЕ:", users); //!

        console.log(`ОБНОВЛЕННЫЙ ПОЛЬЗОВАТЕЛЬ с ID: ${id}:`.rainbow); //!
        console.table([user]); //!

        await writeUsers(users);

        console.log("END-->PATCH/:id".rainbow); //!

        res.status(200).json(user)

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});


//! 5. Удаление ОДНОГО ПОЛЬЗОВАТЕЛЯ по id
router.delete("/:id", async (req, res) => {
    try {
        console.log("START-->DELETE/:id".red); //!
        // const id = req.params.id; //1
        const { id } = req.params; //2
        const users = await getUsersList();
        const [deletedUser] = users.filter(user => String(user.id) === String(id)); //* - это ОБЪЕКТ c удаленным User
        const filteredUsers = users.filter(user => String(user.id) !== String(id)); //* - это МАССИВ ОБЪЕКТОB НОВЫХ ПОЛЬЗОВАТЕЛЕЙ

        if (filteredUsers.length === users.length) {
            console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, id.red); //!
            lineBreak();
            console.log("END-->DELETE/:id".red);
            return res.status(404).json({
                status: "error",
                code: 404,
                message: `User wiht id:'${id}' not found`
            });
        };
        console.log(`Этот ПОЛЬЗОВАТЕЛЬ УДАЛЕН ID: ${id}:`.bgRed.yellow); //!
        console.table([deletedUser]); //!
        await writeUsers(filteredUsers);
        console.log("END-->DELETE/:id".red); //!

        // res.status(200).json({ message: "User was remove" });
        res.status(200).json({
            message: `User wiht id:'${id}' was remove:`, ...deletedUser
        });
        // res.status(204);

        res.status(200).json({
            status: "success",
            code: 204,
            message: `User wiht id:'${id}' was remove:`,
            data: {
                result: deletedUser
            }
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//! 6. Удаление ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
router.delete("/", async (req, res) => {
    try {
        console.log("START-->DELETE/All".bgRed.yellow); //!
        lineBreak();
        console.log("ВСЕ ПОЛЬЗОВАТЕЛИ УДАЛЕНЫ...".bgRed.white); //!
        await writeUsers([]);
        lineBreak();
        console.log("END-->DELETE/All".bgRed.yellow); //!

        res.status(200).json({ message: "ALL Users were remove..." });


    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



module.exports = router