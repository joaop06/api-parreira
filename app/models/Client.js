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
        },
        // created_at: {
        //     editable: false,
        //     type: DataTypes.DATE,
        //     label: 'Criado em'
        // },
        // updated_at: {
        //     editable: false,
        //     type: DataTypes.DATE,
        //     label: 'Atualizado em'
        // }
    }

    const model = sequelize?.define('Client', attrs, {
        tableName: 'client',
        underscored: true,
        timestamps: true,
        paranoid: true
    })

    return { model, attrs }
}

