'use strict';

module.exports = (sequelize, DataTypes) => {
    let empresa = sequelize.define('empresa',{	
		id: {
			field: 'id_empresa',
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: false
		},	
		nome: {
			field: 'nome',
			type: DataTypes.STRING,
			allowNull: false
		},
		pais: {
			field: 'pais',
			type: DataTypes.STRING,
			allowNull: false
		},
		cidade: {
			field: 'cidade',
			type: DataTypes.STRING, 
			allowNull: false
		},
        fk_staff: {
			field: 'fk_staff',
			type: DataTypes.INTEGER, 
			allowNull: false
		},
	}, 
	{
		tableName: 'empresa', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return empresa;
};
