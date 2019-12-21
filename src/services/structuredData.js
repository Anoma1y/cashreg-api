import { getPagination, hasPagination } from '../helpers/pagination';
import { getMultipleQueryValues, getMultipleOrder } from '../helpers/sql';

class StructuredData {
	getOrder = (req) => {
		const {
			order_by_key = 'id',
			order_by_direction = 'desc',
		} = req.query;

		return getMultipleOrder(
			getMultipleQueryValues(order_by_key),
			getMultipleQueryValues(order_by_direction)
		);
	};

	withoutPagination = async (req, where, listServiceMethod) => {
		const order = this.getOrder(req);

		return listServiceMethod({
			json: true,
			where,
			order,
		});
	};

	withPagination = async (req, where, countServiceMethod, listServiceMethod) => {
		const order = this.getOrder(req);

		const total_records = await countServiceMethod(where);

		if (!hasPagination(req)) {
			return this.withoutPagination(req, where, listServiceMethod);
		}

		const { page, num_on_page, offset, limit } = getPagination(req, total_records);

		if (total_records === 0) {
			return {
				page: 1,
				data: [],
				num_on_page,
				total_records
			}
		}

		const data = await listServiceMethod({
			json: true,
			offset,
			limit,
			where,
			order,
		});

		return {
			page,
			data,
			num_on_page,
			total_records
		}
	};

	withPaginationNew = Model => {
		const pagination = async ({ page = null, num_on_page = null, ...params }) => {
			const options = Object.assign({}, params);

			if (!page || !num_on_page) {
				return Model.findAll(options);
			}

			const countOptions = Object.keys(options).reduce((acc, key) => {
				if (!['order', 'attributes', 'include'].includes(key)) {
					acc[key] = options[key]
				}

				return acc
			}, {});

			const total_records = await Model.count(countOptions);

			const page_count = Math.ceil(total_records / num_on_page);

			options.limit = num_on_page;
			options.offset = num_on_page * (page - 1);

			if (params.order) options.order = params.order;

			const data = await Model.findAll(options);

			return { data, page_count, total_records, num_on_page: Number(num_on_page), page: Number(page) }
		};

		const instanceOrModel = Model.Instance || Model;

		instanceOrModel.paginate = pagination;
	}
}

export default new StructuredData();
