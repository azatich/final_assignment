const { User, DeletedUser, Post } = require('../database/schemas');
const bcrypt = require('bcrypt');

const adminController = {

    getAdminPage: async (req, res) => {
        const users = await User.find({})
        users.forEach(user => { 
            user.registrationDate = user.registrationDate.toLocaleString('en-US', {timeZone: 'Asia/Almaty'})
            user.lastActive = user.lastActive.toLocaleString('en-US', {timeZone: 'Asia/Almaty'})
        })
        await res.render('pages/admin_panel/adminPanel', {users: users, user: req.session.user})
    },

    getPostPage: async (req, res) => {
        try {
            const posts = await Post.find();
            await res.render('pages/main_page/posts', {posts: posts, user: req.session.user, currentLang: req.i18n.language})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addPost: async (req, res) => {
        const { title, content } = req.body;
        let { image1, image2, image3 } = req.body;
        const images = [image1, image2, image3].filter(imageUrl => !!imageUrl);
        try {
            const newId = await Post.countDocuments();
            const newPost = new Post({
                post_id: newId + 1,
                title: title, 
                images: images, 
                content: content, 
                postedDate: new Date() 
            });
            await newPost.save();
            res.redirect('/posts')
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deletePost: async (req, res) => {
        const postId = req.params.id;
        try {
            await Post.findByIdAndDelete(postId);
            res.redirect('/posts');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    editPost: async (req, res) => {
        const postId = req.params.id;
        const { title, image1, image2, image3, content } = req.body;
        try {
            const post = await Post.findById(postId);
            if (title) post.title = title;
            if (image1) post.images[0] = image1;
            if (image2) post.images[1] = image2;
            if (image3) post.images[2] = image3;
            if (content) post.content = content;
            post.lastUpdateDate = new Date();
            await post.save();
            res.redirect('/posts');
        } catch (error) {
            console.error('Error updating the post:', error);
            res.status(500).send('An error occurred while updating the post');
        }
    },

    addUser: async (req, res) => {
        try {
            const { username, phone, password } = req.body;
            const user = await User.findOne({username});
            if (user) { 
                res.status(400).json({message: 'Username already taken'});
                return;
            }
            const phoneExist = await User.findOne({phone});
            if (phoneExist) { 
                res.status(400).json({message: 'Phone number already registered'});
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username: username,
                phone: phone,
                password: hashedPassword,
                registrationDate: new Date()
            })
            await newUser.save();
            res.redirect('/adminPanel')
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { username } = req.body;
            const user = await User.findOne({username});
            if (!user) { 
                res.status(400).json({message: `User doesn't exist`});
                return;
            }
            if (username === req.session.user.username) {
                res.status(400).json({message: `Can't delete yourself :)` });
                return;
            }
            if (user.isAdmin) {
                res.status(400).json({message: `Can't delete admin user`});
                return;
            }
            await User.findOneAndDelete({username: username})

            const deletedUser = new DeletedUser({
                username: user.username,
                phone: user.phone,
                registrationDate: user.registrationDate,
                deletionDate: new Date()
            })
            await deletedUser.save();
            res.redirect('/adminPanel')
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    editUser: async (req, res) => {
        try {
            const { username, newUsername, newPhone, newPassword } = req.body;
            const user = await User.findOne({username});
            if (!user) { 
                res.status(400).json({message: `User doesn't exist`});
                return;
            }
            if (newUsername) {
                user.username = newUsername;
            }
            if (newPhone) {
                user.phone = newPhone; 
            }
            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
            }

            await user.save();
            res.redirect('/adminPanel') 
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    getDeletedUsers: async (req, res) => {
        try {
            username = req.session.user.username;
            const deletedUsers = await DeletedUser.find({})
            deletedUsers.forEach(user => {
                user.registrationDate = user.registrationDate.toLocaleString('en-US', {timeZone: 'Asia/Almaty'});
                user.deletionDate = user.deletionDate.toLocaleString('en-US', {timeZone: 'Asia/Almaty'});
            });
            res.render('pages/admin_panel/deletedUsersPage', {deletedUsers: deletedUsers, username: username});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: err.message});
        }
    },

    getlastActive: async (req, res) => {
        try {
            username = req.session.user.username;
            const users = await User.find({})
            users.forEach(user => {
                user.lastActive = user.lastActive.toLocaleString('en-US', {timeZone: 'Asia/Almaty'});
            });
            res.render('pages/admin_panel/lastActive', {lastActive: users, username: username});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: err.message});
        }
    },
}

module.exports = { adminController };