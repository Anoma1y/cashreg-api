import { getPagination, hasPagination } from '../helpers/pagination';
import { getMultipleQueryValues, getMultipleOrder } from '../helpers/sql';

class StructuredData {
	withPagination= Model => {
		const pagination = async ({ page = null, num_on_page = 20, ...params }) => {
			const options = Object.assign({}, params);

			if (!page) { // todo add optional field - required paginate
				return Model.findAll(options);
			}

			const countOptions = Object.keys(options).reduce((acc, key) => {
				if (!['order', 'attributes', 'include'].includes(key)) {
					acc[key] = options[key];
				}

				return acc
			}, {});

			const total_records = await Model.count(countOptions);

			const page_count = Math.ceil(total_records / num_on_page);

			options.limit = num_on_page;
			options.offset = num_on_page * (page - 1);

			if (params.order) options.order = params.order;

			const data = await Model.findAll(options);

			return {
				data,
				page_count,
				total_records,
				num_on_page: Number(num_on_page),
				page: Number(page)
			}
		};

		const instanceOrModel = Model.Instance || Model;

		instanceOrModel.paginate = pagination;
	}
}

export default new StructuredData();
