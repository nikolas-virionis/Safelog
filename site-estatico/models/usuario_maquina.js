'use strict';

module.exports = (sequelize, DataTypes) => {
    let usuario_maquina = sequelize.define('usuario_maquina',{	
		id_usuario_maquina: {
			field: 'id_maquina',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		fk_usuario: {
			field: 'fk_usuario',
			type: DataTypes.STRING,
			allowNull: false
		},
		fk_maquina: {
			field: 'fk_maquina',
			type: DataTypes.STRING, 
			allowNull: false
		},
	}, 
	{
		tableName: 'usuario_maquina', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return usuario_maquina;
};
