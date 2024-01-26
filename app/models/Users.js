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
            type: DataTypes ? DataTypes.STRING(80) : 'string',
            allowNull: false,
            label: 'Nome'
        },
        email: {
            type: DataTypes ? DataTypes.STRING(120) : 'string',
            allowNull: false,
            label: 'E-mail'
        },
        username: {
            type: DataTypes ? DataTypes.STRING(20) : 'string',
            allowNull: false,
            label: 'Nome de usuário'
        },
        password: {
            type: DataTypes ? DataTypes.STRING(100) : 'string',
            allowNull: false,
            label: 'Senha'
        }
    }

    const model = sequelize?.define('Users', attrs, {
        tableName: 'users',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}