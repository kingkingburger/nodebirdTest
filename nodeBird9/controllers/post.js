const Post = require('../models/post')
const Hashtag = require('../models/hashtag')
exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
}

// 실제 게시글 업로드하는 부분
exports.uploadPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        console.log('req.body = ' , req.body);
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            console.log('result = ' , result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};