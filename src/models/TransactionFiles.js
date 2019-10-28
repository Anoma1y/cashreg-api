import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER
	},
	transaction_id: {
		allowNull: false,
		primaryKey: true,
		type: Sequelize.INTEGER,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		references: {
			model: "transactions",
			key: "id"
		}
	},
	file_id: {
		allowNull: false,
		primaryKey: true,
		type: Sequelize.INTEGER,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		references: {
			model: "files",
			key: "id"
		}
	},
	permissions: {
		allowNull: false,
		type: Sequelize.INTEGER,
	},
	created_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		get() {
			return dateToUnix(this.getDataValue('created_at'))
		},
	},
	updated_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		get() {
			return dateToUnix(this.getDataValue('updated_at'))
		},
	},
	deleted_at: {
		allowNull: true,
		type: Sequelize.DATE,
		defaultValue: null,
		get() {
			return dateToUnix(this.getDataValue('deleted_at'))
		},
	},
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		deletedAt: 'deleted_at',
	};

	const TransactionFiles = sequelize.define("transaction_files", attributes, options);

	// TransactionFiles.associate = (models) => {
	// 	models.TransactionFiles.hasOne(models.Category, {
	// 		onDelete: 'CASCADE',
	// 		foreignKey: 'workspace_id'
	// 	});
	//
	// 	models.Transaction.belongsTo(models.TransactionFiles, {
	// 		onDelete: 'CASCADE',
	// 		foreignKey: 'workspace_id'
	// 	});
	// };

	return TransactionFiles;
}
