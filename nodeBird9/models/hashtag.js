const Sequelize = require("sequelize")


class Hashtag extends Sequelize.Model {
    static initiate(sequelize) {
        Hashtag.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        // as는 왜안적어주냐면 테이블 일므을 햇갈일 일이 없기 때문
        db.Hashtag.belongsToMany(db.Post,{ through: 'PostHashtag'})
    }
}
module.exports = Hashtag