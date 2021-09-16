'use strict';

module.exports = (sequelize, DataTypes) => {
    let maquina = sequelize.define('maquina',{	
		id: {
			field: 'id_maquina',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: false
		},	
		nome: {
			field: 'nome',
			type: DataTypes.STRING,
			allowNull: false
		},
		senha: {
			field: 'senha',
			type: DataTypes.STRING, 
			allowNull: false
		},
        fk_empresa: {
			field: 'fk_empresa',
			type: DataTypes.STRING, 
			allowNull: false
		},
	}, 
	{
		tableName: 'maquina', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return maquina;
};
