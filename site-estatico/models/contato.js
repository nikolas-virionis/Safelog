'use strict';

module.exports = (sequelize, DataTypes) => {
    let contato = sequelize.define('contato',{	
		fk_usuario: {
			field: 'fk_usuario',
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: true
		},	
        id_contato: {
			field: 'id_contato',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		valor: {
			field: 'valor',
			type: DataTypes.STRING,
			allowNull: true
		},
		fk_forma_contato: {
			field: 'fk_forma_contato',
			type: DataTypes.INTEGER, 
			allowNull: true
		},
	}, 
	{
		tableName: 'staff', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return contato;
};
