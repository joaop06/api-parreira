module.exports = (sequelize, DataTypes) => {
    const attrs = {
        id: {
            type: DataTypes ? DataTypes.INTEGER(20) : 'number',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            label: 'Id'
        },
        client_id: {
            type: DataTypes ? DataTypes.INTEGER(20) : 'number',
            allowNull: false,
            label: 'Id cliente'
        },
        status: {
            type: DataTypes ? DataTypes.STRING(20) : 'string',
            allowNull: true,
            label: 'Status'
        }
    }

    const model = sequelize?.define('ServiceOrder', attrs, {
        tableName: 'service_order',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}