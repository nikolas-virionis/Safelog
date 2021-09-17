'use strict';

module.exports = (sequelize, DataTypes) => {
    let componente = sequelize.define('componente',{	
		id_componente: {
			field: 'id_componente',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		tipo: {
			field: 'tipo',
			type: DataTypes.STRING,
			allowNull: false
		},
	}, 
	{
		tableName: 'componente', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return componente;
};
