module.exports = (sequelize, DataTypes) => {
    const Id = sequelize.define('Id', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    },{
        tableName: 'ids',
        freezeTableName: true
    });

    return Id;
}