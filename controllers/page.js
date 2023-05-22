const {Post, User} = require('../models')
exports.renderProfile = (req, res, next) => {
    res.render('profile', {title: '내 정보 - NodeBird'})
};


exports.renderJoin = (req, res, next) => {
    res.render('join', {title: '내 정보 - NodeBird'})
};


exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        console.log('posts = ' , posts);
        console.log('posts.length = ' , posts.length);
        console.log('posts.User = ' , posts.User);
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// 라우터 -> 컨트롤러 -> 서비스