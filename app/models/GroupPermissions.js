module.exports = (sequelize, DataTypes) => {
    const attrs = {
        id: {
            type: DataTypes ? DataTypes.INTEGER(20) : 'number',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            label: 'Id'
        },
        group_id: {
            type: DataTypes ? DataTypes.INTEGER(20) : 'number',
            allowNull: false,
            label: 'Grupo'
        },
        permission_id: {
            type: DataTypes ? DataTypes.INTEGER(20) : 'number',
            allowNull: false,
            label: 'Permissão'
        }
    }

    const model = sequelize?.define('GroupPermissions', attrs, {
        tableName: 'group_permissions',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}