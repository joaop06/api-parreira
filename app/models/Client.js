module.exports = (sequelize, DataTypes) => {
    const attrs = {
        id: {
            type: DataTypes ? DataTypes.INTEGER(20) : 'number',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            label: 'Id'
        },
        name: {
            type: DataTypes ? DataTypes.STRING(50) : 'string',
            allowNull: false,
            label: 'Nome'
        },
        document: {
            type: DataTypes ? DataTypes.BIGINT : 'number',
            allowNull: true,
            unique: true,
            label: 'Documento'
        }
    }

    const model = sequelize?.define('Client', attrs, {
        tableName: 'client',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}

