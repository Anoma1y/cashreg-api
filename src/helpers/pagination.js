const NUM_ON_PAGE = 20;

export const getPagination = (req, total_records) => {
	let page = parseInt(req.query.page || 1);

	let num_on_page = parseInt(req.query.num_on_page || NUM_ON_PAGE);

	if (num_on_page > 100) {
		num_on_page = 100;
	}

	const page_count = Math.ceil(total_records / num_on_page);

	if (!page) {
		page = 1;
	}

	if (page > page_count) {
		page = page_count
	}

	const offset = (page - 1) * num_on_page;
	const limit = offset + num_on_page;

	return {
		page,
		num_on_page,
		offset,
		limit,
	}
};
