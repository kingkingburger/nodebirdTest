const axios = require('axios');

exports.test = async (req, res, next) => {
    try{
        const tokenResult = await axios.post('http://localhost:8002/v1/token', {
            clientSecret: process.env.CLINET_SECRET,
        })
        // 성공적으로 가지고 오면 200번임
        if(tokenResult.data?.code === 200){
            // 매번 토큰을 받급 받을 수 없으니 세션에 저장
        }
    } catch (error) {

    }
}