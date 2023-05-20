const Post = require('../models/post')
const Hashtag = require('../models/hashtag')
exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
}

// 실제 게시글 업로드하는 부분
exports.uploadText = async (req, res, next) => {
    // req.body.content, req.body.url을 활용할 수 있다.
    try {
        //
        const post = await Post.create({
           content: req.body.content,
           img: req.body.url,
           UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);

        if(hashtags){
            const result = await Promise.all( hashtags.map((tag) =>{
                return Hashtag.findOrCreate({
                    where : { title: tag.splice(1).toLowerCase()}
                });
            }));
            console.log(result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');

    } catch (error) {
        console.error(error);
        next(error);
    }
}