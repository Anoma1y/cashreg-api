import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
	id: {
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		type: Sequelize.INTEGER,
	},
	name: {
		allowNull: true,
		type: Sequelize.STRING(100),
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: "users",
			key: "id"
		}
	},
	workspace_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: "workspaces",
			key: "id"
		}
	},
	contragent_id: {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: "contragents",
			key: "id"
		}
	},
	project_id: {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: "projects",
			key: "id"
		}
	},
	category_id: {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: "categories",
			key: "id"
		}
	},
	currency_id: {
		type: Sequelize.INTEGER,
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
		defaultValue: Sequelize.NOW,
		get() {
			return dateToUnix(this.getDataValue('created_at'))
		},
	},
	registered_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get() {
			return dateToUnix(this.getDataValue('registered_at'))
		},
	},
	updated_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get() {
			return dateToUnix(this.getDataValue('updated_at'))
		},
	},
	invalidated_at: {
		allowNull: true,
		type: Sequelize.DATE,
		defaultValue: null,
		get() {
			return dateToUnix(this.getDataValue('invalidated_at'))
		},
	},
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		invalidatedAt: 'invalidated_at',
	};

	const Transaction = sequelize.define("transactions", attributes, options);

	Transaction.associate = (models) => {
		models.Transaction.belongsToMany(models.File, {
			through: models.TransactionFiles,
			foreignKey: 'transaction_id',
			as: 'files',
		});
	};

	return Transaction;
}
