import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
	id: {
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		type: Sequelize.INTEGER,
	},
	user_id: {
		type: Sequelize.INTEGER,
		onDelete: "CASCADE",
		allowNull: false,
		references: {
			model: "users",
			key: "id"
		}
	},
	workspace_id: {
		type: Sequelize.INTEGER,
		onDelete: "CASCADE",
		allowNull: false,
		references: {
			model: "workspaces",
			key: "id"
		}
	},
	contragent_id: {
		type: Sequelize.INTEGER,
		onDelete: "CASCADE",
		allowNull: true,
		references: {
			model: "contragents",
			key: "id"
		}
	},
	category_id: {
		type: Sequelize.INTEGER,
		onDelete: "CASCADE",
		allowNull: false,
		references: {
			model: "categories",
			key: "id"
		}
	},
	currency_id: {
		type: Sequelize.INTEGER,
		onDelete: "CASCADE",
		allowNull: false,
		references: {
			model: "currencies",
			key: "id"
		}
	},
	sum: {
		allowNull: false,
		type: Sequelize.INTEGER,
	},
	type: {
		allowNull: false,
		type: Sequelize.INTEGER,
	},
	comment: {
		allowNull: true,
		type: Sequelize.TEXT,
	},
	created_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		get() {
			return dateToUnix(this.getDataValue('created_at'))
		},
	},
	registered_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		get() {
			return dateToUnix(this.getDataValue('registered_at'))
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
	}
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		deletedAt: 'deleted_at',
	};

	const Transaction = sequelize.define("transactions", attributes, options);

	Transaction.associate = (models) => {

	};

	return Transaction;
}
