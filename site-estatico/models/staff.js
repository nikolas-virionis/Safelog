'use strict';

module.exports = (sequelize, DataTypes) => {
    let staff = sequelize.define('staff',{	
		id: {
			field: 'id_staff',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		nome: {
			field: 'nome',
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			field: 'email',
			type: DataTypes.STRING,
			allowNull: false
		},
		senha: {
			field: 'senha',
			type: DataTypes.STRING, 
			allowNull: false
		},
	}, 
	{
		tableName: 'staff', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return staff;
};
