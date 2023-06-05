const axios = require('axios');

exports.test = async (req, res, next) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLINET_SECRET,
            })
            // 성공적으로 가지고 오면 200번임
            if (tokenResult.data?.code === 200) {
                // 매번 토큰을 받급 받을 수 없으니 세션에 저장
                req.session.jwt = tokenResult.data.token;
            } else {
                return res.status(tokenResult.data?.code).json(tokenResult.data);
            }
        }
        const result = await axios.get('http://localhost:8002/v1/test',{
            headers: { authorization: req.session.jwt }
        });
        return res.json(result.data);
    } catch (error) {
        if(error.response?.status === 419){
            return res.json(error.response.data);
        }
        return next(error);
    }
}


const URL = process.env.URL;
axios.defaults.headers.origin = process.env.ORIGIN;
// axios.defaults.headers.common.origin = 'http://localhost:4000';

const request = async (req, api) => {
    try{
        // 토큰이 없다면 발급받기
        if(!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`,{
                clientSecret: process.env.CLINET_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`,{
            headers: { authorization: req.session.jwt },
        });
    }catch(error){
        if(error.response?.status === 419){
            delete req.session.jwt;
            return request(req,api);
        }
        return error.response;
    }
};

exports.getMyPosts = async (req, res, next) => {
    try{
        const result = await request(req, '/posts/my');
        res.json(result.data);
    }catch(error){
        console.error(error);
        next(error)
    }
};

exports.searchByHashtag = async (req, res, next) => {
    try{
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    }catch(error){
        console.error(error);
        next(error)
    }
};