module.exports = (sequelize, DataTypes) => {
    const attrs = {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            label: 'Id'
        },
        client_id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            label: 'Id cliente'
        },
        status: {
            type: DataTypes.STRING(20),
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