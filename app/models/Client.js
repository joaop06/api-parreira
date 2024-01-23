module.exports = (sequelize, DataTypes) => {
    const attrs = {
        id: {
            type: DataTypes.INTEGER(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            label: 'Id'
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            label: 'Nome'
        },
        document: {
            type: DataTypes.BIGINT,
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

