'use strict';

module.exports = (sequelize, DataTypes) => {
    let categoria_medicao = sequelize.define('categoria_medicao',{	
		id_categoria_medicao: {
			field: 'id_categoria_medicao',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: false
		},	
		medicao_limite: {
			field: 'medicao_limite',
			type: DataTypes.DECIMAL,
			allowNull: true
		},
        fk_maquina: {
			field: 'fk_maquina',
			type: DataTypes.STRING,
			allowNull: true
		},
        fk_componente: {
			field: 'fk_componente',
			type: DataTypes.INTEGER,
			allowNull: true
		},
        fk_tipo_medicao: {
			field: 'fk_tipo_medicao',
			type: DataTypes.INTEGER,
			allowNull: true
		},
	}, 
	{
		tableName: 'categoria_medicao', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return categoria_medicao;
};
