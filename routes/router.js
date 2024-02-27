const express = require('express');
const router = express.Router();
const { movieController } = require('../controllers/mainController')
const { logregController } = require('../controllers/log-regController')
const { authenticateUser} = require('../authenticator/authentication')
const { adminController } = require('../controllers/adminController')
const { actorController } = require('../controllers/actorController')
const { userController } = require('../controllers/userController')

router.get('/movie', authenticateUser, movieController.getMoviePage)
router.post('/movie', movieController.getMovieData)

router.get('/registration', logregController.getRegistrationPage)
router.post('/getDataFromReg', logregController.register);
router.get('/login', logregController.getLoginPage);
router.post('/getDataFromLog', logregController.login);

router.get('/logout', logregController.logout)

router.get('/adminPanel', authenticateUser, adminController.getAdminPage);
router.post('/addUser', authenticateUser, adminController.addUser);
router.post('/deleteUser', authenticateUser, adminController.deleteUser);
router.post('/editUser', authenticateUser, adminController.editUser);
router.get('/deletedUsers', authenticateUser, adminController.getDeletedUsers);
router.get('/lastActive', authenticateUser, adminController.getlastActive);

router.get('/posts', authenticateUser, adminController.getPostPage)
router.post('/posts', authenticateUser, adminController.addPost)
router.delete('/posts/delete/:id', authenticateUser, adminController.deletePost);
router.put('/posts/edit/:id', authenticateUser, adminController.editPost);

router.post('/comment/:id', authenticateUser, userController.comment);
router.put('/posts/likePost/:id', authenticateUser, userController.likePost);

router.get('/actor', authenticateUser, actorController.getActorsPage)
router.post('/actor', actorController.getActorInfo)

router.get('/change-lang/:lang', (req, res) => {
    const selectedLang = req.params.lang;
    req.session.lang = selectedLang;
        req.i18n.changeLanguage(selectedLang, (err) => {
        if (err) {
            console.error('Error changing language:', err);
            return res.status(500).send('Error changing language');
        }

        req.session.save(() => {
            const referrer = req.get('Referrer');
            res.redirect(referrer);
        });
    });
});

module.exports = router;