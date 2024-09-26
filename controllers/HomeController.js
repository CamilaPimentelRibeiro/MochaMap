const express = require('express');
const homeController = express.Router();
const config = require(`${__dirname}/../server/config/config`);

homeController.use(express.static(config.ROOT));

homeController.get('/', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('index.html');
})
homeController.get('/index.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('index.html');
})
homeController.get('/home.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('home.html');
})
homeController.get('/register.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('register.html');
})
homeController.get('/find.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('find.html');
})
homeController.get('/user.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('user.html');
})
homeController.get('/registerError.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('registerError.html');
})
homeController.get('/loginError.html', (request, response) => {
    config.logFile(request, logs)
    response.sendFile('loginError.html');
})
module.exports = homeController;