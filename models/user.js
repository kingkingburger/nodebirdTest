const Sequelize = require("sequelize")


class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email:{
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 자동으로 추적
            underscored: false, // 카멜케이스 쓰기 때문에 false
            modelName: 'User', // js에서 쓰는 이름
            tableName: 'user', // db에서 쓰는 이름
            paranoid: true, // deleteadAt 유저 삭제일 추적, soft delete
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        db.User.hasMany(db.Post); // 한사람이 어려개 게시글을 작성할 수 있다
        db.User.belongsToMany(db.User,{ // 팔로워(나)
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        }); // 한사람이 여러명에 팔로잉 할 수 있다.
        db.User.belongsToMany(db.User,{ // 팔로잉(유명 연예인)
            foreignKey: 'followingId',
            as: 'Followings',
            through: 'Follow'
        }); // 한사람이 여러명에 팔로잉 할 수 있다.
    }
}

module.exports= User