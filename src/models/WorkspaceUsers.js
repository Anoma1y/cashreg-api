import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
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
		defaultValue: Sequelize.NOW,
		get() {
			return dateToUnix(this.getDataValue('created_at'))
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
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
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
