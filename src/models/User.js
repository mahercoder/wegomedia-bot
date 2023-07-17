module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        fullname: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING
        },
        referals: {
            type: DataTypes.STRING,
            defaultValueL: ''
        },
        district: {
            type: DataTypes.INTEGER
        },
        region: {
            type: DataTypes.INTEGER
        },
        language_code: {
            type: DataTypes.STRING,
            defaultValue: 'uz'
        }
    },{
        tableName: 'users',
        freezeTableName: true
    })

    /*******   ASSOCIATION-METHODS    *******/
    // User.associate = function(models) {
    //     this.belongsToMany(models.Game, 'game_user');
    // }

    return User
}