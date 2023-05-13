const Sequelize = require("sequelize")


class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 자동으로 추적
            underscored: false, // 카멜케이스 쓰기 때문에 false
            modelName: 'Post', // js에서 쓰는 이름
            tableName: 'posts', // db에서 쓰는 이름
            paranoid: false, // 복구 불가
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        db.Post.belongsTo(db.User); // 게시글은 유저에 속해있다.
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'}) //
        // db.sequelize.models.PostHashtag
    }
}
module.exports= Post