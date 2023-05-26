const Sequelize = require('sequelize');
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV  || 'development';
const config = require('../config/config.json')[env];
const db = {};
// 연결만 만들어놓은것 입니다. 실행은 app.js에서 또 해야합니다.
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;


const basename = path.basename(__filename) //index.js
fs.readdirSync(__dirname)
    .filter(file =>{ // .model.js 걸러내기
      // index.js 제외, 숨김 파일 제외, .js 문자 제거
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    })
    .forEach((file) =>{
      const model = require(path.join(__dirname, file));
      //model.name 은 class 이름이 됩니다.
      console.log(file, model.name);
      // db객체에 넣어주고 initiate를 쫙해줍니다.
      db[model.name] = model;
      model.initiate(sequelize);
    });

// initiate 후 associate 하기 (순서 중요)
Object.keys(db).forEach(modelName =>{
  if(db[modelName].associate){
    db[modelName].associate(db);
  }
})

// db.User = User;
// db.Post = Post;
// db.Hashtag = Hashtag;
// User.initiate(sequelize)
// Post.initiate(sequelize)
// Hashtag.initiate(sequelize)
// User.associate(db)
// Post.associate(db)
// Hashtag.associate(db)

module.exports = db;