module.exports = (sequelize, DataTypes) => {
    const Ringtones = sequelize.define('Ringtones', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        file_url: {
            type: DataTypes.STRING
        },
        post_id: {
            type: DataTypes.STRING
        },
        preview_file_url: {
            type: DataTypes.STRING
        },
        preview_post_id: {
            type: DataTypes.STRING
        }
    },{
        tableName: 'ringtones',
        freezeTableName: true
    })

    return Ringtones
}