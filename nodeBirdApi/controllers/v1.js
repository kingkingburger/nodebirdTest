const { Domain, User, Post, Hashtag } = require('../models');
const jwt = require('jsonwebtoken')
// 토큰 발급
exports.createToken =  async (req, res) =>{
    const { clientSecret } = req.body;
    try{
        const domain = Domain.findOne({
            where: { clientSecret },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
            }]
        });
        if(!domain){
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인 입니다. 먼저 도메인을 등록하세요.'
            })
        }
        // 토큰 만들기
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'nodebird',
        });

        // 토큰 발급 알림 메시지
        return res.json({
            code:200 ,
            message: '토큰이 발급되었습니다.',
            token
        })
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        })
    }
}

exports.tokenTest = async (req, res) =>{
    res.json(res.locals.decoded);
}

// promise로 만들기
exports.getMyPosts =  (req, res) =>{
    Post.findAll({where: {userId: res.locals.decodeed.id} })
        .then((posts) =>{
            res.json({
                code:200,
                payload: posts,
            })
        })
        .catch((error) =>{
            return res.status(500).json({
                code:500,
                message: '서버 에러',
            })
        })
}


exports.getPostsByHashtag = async (req, res) =>{
    try{
        const hashtag = await Hashtag.findOne({ where : { title: req.params.title} });
        const post = await hashtag.getPosts();

        if(!hashtag){
            return res.status(404).json({
                code:404,
                message: '검색결과가 없습니다.'
            })
        }

        if(post.length === 0){
            return res.status(404).json({
                code:404,
                message: '검색결과가 없습니다.'
            })
        }

        return res.json({
            code:200,
            payload: posts,
        })
    }catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            message: '서버 에러'
        })
    }
}