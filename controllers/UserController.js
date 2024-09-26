const mongoDB = require('mongoose');
const express = require('express');
const session = require('express-session');
const app = express();
const config = require(`${__dirname}/../server/config/config`);
const userSchema = require(`${__dirname}/../models/userSchema.js`);
const user = require(`${__dirname}/../models/user.js`);
const bcrypt = require("bcrypt")
const userController = express.Router();
let users = []
let authenticated = []


mongoDB.connect("mongodb+srv://lvieiradepaulo00:mkFzijF7cPJMcWv0@finalproject2600.jescjru.mongodb.net/finalProject2600?retryWrites=true&w=majority&appName=finalProject2600")
    .then(() => {
        console.log("connected to the database");
    })
    .catch(() => {
        console.log("failed to connect to the database");
    })

const db = new mongoDB.model(`users`, new mongoDB.Schema(userSchema));

/* this is the session thing that is suppposed to work*/
userController.use(express.json());
userController.use(session({
    secret: 'your_secret_key', // This secret key should be a secure random string
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 30 }
}));


userController.post('/register', async(request, response) => {
    console.info(`\t|Inside app.post('/register')`)
    const { firstName, lastName, username, password } = request.body;

    // console.log(`\t|Password = ${password}`);

    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS);

    // console.log(`${password} hash is ${hashed}`);

    const newUser = user(firstName, lastName, username, hashed);

    if (users.length === 0)
        users = await db.find();

    // console.log(users);
    const isUser = users.filter((u) => u.username === username)[0]

    if (!isUser) {
        users.push(newUser);
        authenticated.push(username);
        await db.insertMany(newUser);
        try {
            request.session.username = username;
            console.log(request.session.username);
        } catch (error) {
            console.error('Session error:', error);
            response.status(500).send('session error');
        }
        response.status(200).redirect("/home.html");
        authenticated.push(username); //thios is where the current login info is being saved but how do we access it ??
    } else
        response.status(200).redirect('/registerError.html');
})

userController.post('/delete', async(request, response) => {
    console.info(`\t|Inside app.post('/delete')`)
    const username = request.session.username;
    console.log('trying to delete user')
        //let users = await db.find();
        //const isUser = users.filter((u) => u.username === username)[0];

    if (username) {
        try {
            await db.deleteOne({ username: username });
            console.log(`User ${username} deleted successfully.`);
            response.status(200).send("User deleted successfully.");
        } catch (error) {
            console.error(`'Error deleting user:${username}'`, error);
            response.status(500).send(`'Failed deleting user:${username}'`);
        }
    } else {
        response.status(404).send("User not found.");
    }
});


userController.post('/login', async(request, response) => {
    console.info(`\t|Inside app.post('/signin')`)

    const { username, password } = request.body;

    if (users.length === 0)
        users = await db.find();

    //console.log(users);

    const error = {
        username: username,
        error: `Email or password is incorrect.`,
    }

    // console.log(error);
    const isUser = users.filter((u) => u.username === username)[0]

    console.log(request.sessionID);

    if (!isUser)
        response.status(200).redirect('/loginError.html');
    else {
        const isMatched = await bcrypt.compare(password, isUser.password);
        if (!isMatched) {
            response.status(200).redirect('/loginError.html');
        } else {
            try { // this is suppposed to work <----------here
                request.session.username = isUser.username; // Optionally save other user info}
                console.log(request.session.username);
            } catch (error) {
                console.error('Session error:', error);
                response.status(500).send('session error');
            }
            response.status(200).redirect("/home.html");
            // console.log(config.ROOT+"home.html");
            console.log(`you have logged on as ${username}`)
            authenticated.push(username); //thios is where the current login info is being saved but how do we access it ??
        }
    }
})

userController.get('/profile', async(request, response) => {
    if (request.session.username) {
        const username = request.session.username;

        if (username) {
            users = await db.find();
            const error = {
                    username: username,
                    error: `Email or password is incorrect.`,
                }
                // console.log(error);
            const isUser = users.filter((u) => u.username === username)[0]
            console.log(`You got the profile data from ${username}`)
            console.log(isUser);
            // send the user data back
            response.json(isUser);

        } else {
            response.status(401).send('Please login to view this page.');
        }
    }
});


userController.post('/signout', (request, response) => {
    // console.log('inside /signout')
    username = session.username
        // console.log("authenticated", authenticated)
    authenticated.splice(authenticated.indexOf(username), 1)
        // console.log("authenticated", authenticated)
    request.session.destroy();
    response.status(200).redirect("/index.html");
})
module.exports = userController;