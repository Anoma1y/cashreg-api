import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER
	},
	workspace_id: {
		allowNull: false,
		primaryKey: true,
		type: Sequelize.INTEGER,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		references: {
			model: "workspaces",
			key: "id"
		}
	},
	user_id: {
		allowNull: false,
		primaryKey: true,
		type: Sequelize.INTEGER,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		references: {
			model: "users",
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
			return dateToUnix(this.getDataValue('deleted'))
		},
	},
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		deletedAt: 'deleted_at',
	};

	const Workspace = sequelize.define("workspace_users", attributes, options);

	Workspace.associate = (models) => {
		models.Workspace.hasOne(models.Category, {
			onDelete: 'CASCADE',
			foreignKey: 'workspace_id'
		});

		models.Transaction.belongsTo(models.Workspace, {
			onDelete: 'CASCADE',
			foreignKey: 'workspace_id'
		});
	};

	return Workspace;
}
