'use strict';

module.exports = (sequelize, DataTypes) => {
    let tipo_medicao = sequelize.define('tipo_medicao',{	
		id_tipo_medicao: {
			field: 'id_tipo_medicao',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: false
		},	
		fk_componente: {
			field: 'fk_componente',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: false
		},
        tipo: {
			field: 'tipo',
			type: DataTypes.STRING,
			allowNull: true
		},
        unidade: {
			field: 'unidade',
			type: DataTypes.STRING,
			allowNull: true
		},
	}, 
	{
		tableName: 'tipo_medicao', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return tipo_medicao;
};
