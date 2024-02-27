# final_assignment
The title of the project: Cinema
About: Searching for movies and actors

Before running the project don't forget to run in console: npm i and create .env file and include:

    MONGO_URI = mongodb+srv://azatabdirashituly:20feb2005@cluster0.sellypx.mongodb.net/movieApp
    MOVIE_API_KEY = fc1fef96
    MOVIE_ACTOR_API_KEY = 40f4fffa84de3e45c7dcf179bf3d9c1e
    SESSION_SECRET_KEY = qwerty-secret

Then you can run the program by:

    npm start

*Note:
    Sometimes Cyclic(deploy) session is not working as expected.
    However, in localhost everything works fine.

Admin priveligies: 
    1. Can add, delete and update users(not admins)
    2. Can post and delete, update the post

    admin login: Azat
    admin password: qwerty

User priveligies:
    1. Can see and like, comment the posts admin posted

DIRECTORIES:

    authecticator/
                authentication.js file: contains the authecticator function for checking the session

    controllers/
                actorController.js file: contains the functions for getting actor names, informations with api

                adminController.js file: contains the functions for CRUD operation over users and posts

                log-regController.js file: contains the functions for loggind and registering the user and admin

                mainController.js file: contains the functions for getting movie page and search for movies

                userController.js file: contains the functions for user to like and comment the posts
    database/
            schema.js file: contains the database schemas MongoDB

    locales/
            json files: contains the translations for the locale settings

    routes/
            router.js file: contains the routes

    views/pages/ contains necessary pages







