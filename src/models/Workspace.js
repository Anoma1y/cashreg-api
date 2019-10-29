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
	is_personal: {
		allowNull: false,
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
	deleted_at: {
		allowNull: true,
		type: Sequelize.DATE,
		defaultValue: null,
		get() {
			return dateToUnix(this.getDataValue('deleted_at'))
		}
	}
};

export default (sequelize) => {
	const options = {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		deletedAt: 'deleted_at',
	};

	const Workspace = sequelize.define("workspaces", attributes, options);

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
