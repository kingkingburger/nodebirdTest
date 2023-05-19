const express = require('express')
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlwares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const {afterUploadImage, uploadPost} = require('../controllers/post')

try{
    fs.readdirSync('uploads');
}catch(error){
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) { // 저장할 곳은 uploads 폴더 아래
            cb(null, 'uploads/')
        },
        filename(req, file, cb){
            console.log(file);
            // 확장자를 추출
            const ext = path.extname(file.originalname); // 이미지.png -> 이미지20230519.png 로 바꿔야 합니다. 이미지 파일 중복을 피하기위함
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img') ,afterUploadImage);



const upload2 = multer({

});
// router.post('/', isLoggedIn,uploadPost);

module.exports = router;