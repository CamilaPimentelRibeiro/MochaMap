(() => {
    const config = require(`${__dirname}/config/config`)
    
    const express = require('express')
    const app = express();
    const logs = [];
    const homeController = require(`${__dirname}/../controllers/homeController`)
    const userController = require(`${__dirname}/../controllers/userController`)
    const cafeController = require(`${__dirname}/../controllers/cafeController`)

    /**
     * Middleware declarations
     */
    app.use(express.json());
    app.use(express.static(config.ROOT));
    app.use(express.urlencoded({ extended: false }))

    app.use((request, response, next) => {
        config.logFile(request, logs)
        next()
    })
    
    app.use(homeController);
    app.use(userController);
    app.use(cafeController);

    
    // Start Node.js HTTP webserver
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|Server listening on ${config.PORT}`)
    })
})()