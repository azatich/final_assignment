const { Post } = require('../database/schemas')
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
    }
}

module.exports = {userController};