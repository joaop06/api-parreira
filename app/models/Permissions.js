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
            type: DataTypes ? DataTypes.STRING(255) : "string",
            allowNull: false,
            label: "Nome",
        },
        description: {
            type: DataTypes ? DataTypes.STRING(150) : "string",
            allowNull: true,
            label: "Descrição",
        },
        model: {
            type: DataTypes ? DataTypes.STRING(150) : "string",
            allowNull: true,
            label: "Modelo",
        },
        back_url: {
            type: DataTypes ? DataTypes.STRING(150) : "string",
            allowNull: false,
            label: "Url Back",
        }
    }

    const model = sequelize?.define('Permissions', attrs, {
        tableName: 'permissions',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}