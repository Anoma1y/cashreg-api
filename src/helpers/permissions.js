class BitwisePermissions {
	static PermissionList = {
		administrator: '0x8',
		transaction_create: '0x1',
		transaction_edit: '0x2',
		transaction_invalidate: '0x10000000',
		file_upload: '0x8000000',
		category_create: '0x20',
		category_edit: '0x10',
		category_delete: '0x4',
		project_create: '0x40000',
		project_edit: '0x800',
		project_delete: '0x2000',
		contragent_create: '0x4000000',
		contragent_edit: '0x20000000',
		contragent_delete: '0x40000000',
		workspace_invite_users: '0x80',
		workspace_kick_users: '0x400',
		workspace_change_permission_users: '0x10000',
		workspace_rename: '0x1000',
		workspace_delete: '0x4000',
	};

	// 0x8000	0x20000	0x40	0x100000	0x400000	0x1000000	0x200000	0x800000	0x2000000
	static convertPerms = permNumber => {
		if (isNaN(Number(permNumber)))
			throw new TypeError(`Expected permissions number, and received ${typeof permNumber} instead.`);

		const evaluatedPerms = {};

		for (let perm in BitwisePermissions.PermissionList) {
			evaluatedPerms[perm] = BitwisePermissions.isCan(permNumber, perm);
		}

		return evaluatedPerms;
	};

	static isCan = (permNumber, perm) => Boolean(Number(permNumber) & BitwisePermissions.PermissionList[perm]);

	static check = (permNumber, perm) => {
		if (BitwisePermissions.isCan(permNumber, 'administrator')) return true;

		return BitwisePermissions.isCan(permNumber, perm);
	};

	static calculatePermissions = permArr => {
		let value = 0;

		permArr.forEach(perm => {
			value |= perm;
		});

		return value;
	}
}

export default BitwisePermissions;
