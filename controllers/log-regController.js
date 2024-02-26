const { User } = require('../database/schemas')
const bcrypt = require('bcrypt');

const logregController = {

    getRegistrationPage: async (req, res) => {
        if (req.session.user) {
            return res.redirect('/login');
        }
        await res.render('pages/authentication/registration', {currentLang: req.i18n.language})
    },

    register: async (req, res) => {
        const { username, phone, password, repassword, role } = req.body;
        if (password!== repassword) {
            res.status(400).json({message: 'Passwords do not match'});
            return;
        }
        const phoneExist = await User.findOne({phone});
        if (phoneExist) { 
            res.status(400).json({message: 'Phone number already registered'});
            return;
        }
        if (await User.findOne({username})) { 
            res.status(400).json({message: 'Username already taken'});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (role) {
            const newUser = new User({
                isAdmin: (role === 'admin'),
                username: username,
                phone: phone,
                password: hashedPassword,
                registrationDate: new Date(),
                lastActive: new Date()
            });
            await newUser.save();
            res.redirect('/login')
        } else {
            res.status(400).json({message: 'Role is not defined'})
        }
        
    },

    getLoginPage: async (req, res) => {
        if (req.session.user) {
            return res.redirect('/movie');
        }
        await res.render('pages/authentication/login', {currentLang: req.i18n.language})
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({username});
        if (user && bcrypt.compareSync(password, user.password)) {
            user.lastActive = new Date();
            await user.save();
            req.session.user = {
                isAdmin: user.isAdmin,
                id: user._id,
                username: user.username,
                phone: user.phone,
                likedPosts: user.likedPosts
            };
            res.redirect('/movie')
        } else {
            res.status(400).json({message: 'Username or password is incorrect'});
        }
    },

    logout: async (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    }

}

module.exports = { User, logregController }