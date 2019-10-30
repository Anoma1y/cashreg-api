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
		contragent_create: '0x4000000',
		contragent_edit: '0x20000000',
		contragent_delete: '0x40000000',
		workspace_invite_users: '0x80',
		workspace_delete_users: '0x400',
		workspace_rename: '0x1000',
		workspace_delete: '0x4000',
	};

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
