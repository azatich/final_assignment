const { User, Post } = require('../database/schemas')
const userController = {

    comment: async (req, res) => {
        const postId = req.params.id;
        const { comment } = req.body;
        const { username } = req.session.user;
        try {
            const post = await Post.findById(postId);
            post.comments.push({
                username: username,
                comment: comment
            });
            await post.save();
            res.redirect('/posts');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    likePost: async (req, res) => {
        const postId = req.params.id;
        const { username } = req.session.user;
        try {
            const user = await User.findOne({username: username});
            const index = user.likedPosts.findIndex(likedPost => likedPost.post_id === postId);
            console.log(index);
            console.log(user.likedPosts);

            if (index === -1) {
                user.likedPosts.push({ post_id: postId, liked: true });
            } else {
                user.likedPosts.splice(index, 1);
            }
            await user.save();
            req.session.user = user;
            res.redirect('/posts');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = {userController};