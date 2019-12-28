import DB from '../config/db';

export const TransactionInclude = [
	{
		model: DB.Category,
		attributes: {
			exclude: ['workspace_id', 'created_at', 'updated_at', 'deleted_at'],
		},
	},
	{
		model: DB.Currency,
		attributes: {
			exclude: ['created_at', 'updated_at', 'value', 'nominal', 'enabled'],
		},
	},
	{
		model: DB.Contragent,
		attributes: {
			exclude: ['workspace_id', 'created_at', 'updated_at'],
		},
	},
	{
		model: DB.Workspace,
		attributes: {
			exclude: ['created_at', 'updated_at', 'deleted_at'],
		},
	},
	{
		model: DB.User,
		attributes: {
			exclude: ['password', 'created_at', 'updated_at'],
		},
	},
];

export const TransactionIncludeSingle = [
	{
		model: DB.File,
		as: 'files',
		through: { attributes: [] }
	}
];
