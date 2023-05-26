const Sequelize = require("sequelize")


class Domain extends Sequelize.Model {
    static initiate(sequelize) {
        Domain.init({
            host:{
                type: Sequelize.STRING(80),
                allowNull: true,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'),
                allowNull: false,
            },
            clientSecret: { // 키를 하나만 발급, 사용자 마다 다른 값
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 자동으로 추적
            underscored: false, // 카멜케이스 쓰기 때문에 false
            modelName: 'Domain', // js에서 쓰는 이름
            tableName: 'domains', // db에서 쓰는 이름
            paranoid: true, // deleteadAt 유저 삭제일 추적, soft delete
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        db.Domain.belongsTo(db.User); // 한사람이 어려개 게시글을 작성할 수 있다
    }
}

module.exports= Domain