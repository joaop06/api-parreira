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
            type: DataTypes ? DataTypes.STRING(20) : 'string',
            allowNull: false,
            label: 'Nome'
        },
        restriction: {
            type: DataTypes ? DataTypes.BOOLEAN : 'boolean',
            allowNull: false,
            defaultValue: true,
            label: 'Restrição'
        }
    }

    const model = sequelize?.define('Group', attrs, {
        tableName: 'group',
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}