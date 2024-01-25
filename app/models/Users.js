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
            type: DataTypes.STRING(80),
            allowNull: false,
            label: 'Nome'
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            label: 'E-mail'
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            label: 'Nome de usuário'
        },
        password: {
            type: DataTypes.STRING(100),
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