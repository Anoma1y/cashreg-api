import Sequelize from 'sequelize';
import { dateToUnix } from "../helpers/index";

export const attributes = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER
	},
	name: {
		unique: false,
		allowNull: false,
		type: Sequelize.STRING(100),
	},
	base_currency_id: {
		type: Sequelize.INTEGER,
		allowNull: true,
		onDelete: "CASCADE",
		references: {
			model: "currencies",
			key: "id"
		}
	},
	is_personal: {
		allowNull: false,
		defaultValue: false,
		type: Sequelize.BOOLEAN,
	},
	created_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get() {
			return dateToUnix(this.getDataValue('created_at'))
		}
	},
	updated_at: {
		allowNull: false,
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
		get() {
			return dateToUnix(this.getDataValue('updated_at'))
		}
	},
	archived_at: {
		allowNull: true,
		type: Sequelize.DATE,
		defaultValue: null,
		get() {
			return dateToUnix(this.getDataValue('archived_at'))
		}
	}
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		archivedAt: 'archived_at',
	};

	const Workspace = sequelize.define("workspaces", attributes, options);

	Workspace.associate = (models) => {
		models.Workspace.hasOne(models.WorkspaceUsers, {
			onDelete: 'CASCADE',
			foreignKey: 'workspace_id',
			as: 'info'
		})
		// models.Workspace.belongsTo(models.WorkspaceUsers, {
		// 	onDelete: 'CASCADE',
		// 	foreignKey: 'workspace_id'
		// });

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
