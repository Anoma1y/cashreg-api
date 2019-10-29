import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
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
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	};

	const TransactionFiles = sequelize.define("transaction_files", attributes, options);

	TransactionFiles.associate = (models) => {

	};

	return TransactionFiles;
}
