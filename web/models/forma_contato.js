'use strict';

module.exports = (sequelize, DataTypes) => {
    let forma_contato = sequelize.define('forma_contato',{	
		id: {
			field: 'id_forma_contato',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		nome: {
			field: 'nome',
			type: DataTypes.STRING,
			allowNull: false
		},
	}, 
	{
		tableName: 'forma_contato', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return forma_contato;
};
