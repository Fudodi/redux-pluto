import pick from 'lodash/fp/pick';
import BaseService from './BaseService';

export const SALON_SEARCH_MAX_COUNT = 50;
const SALON_SEARCH_ORDER = 3; // Hot pepper beauty のおすすめ順
const PICK_PROPS = [
  'id',
  'last_update',
  'name',
  'name_kana',
  'name_keisai',
  'logo_image',
  'logo_image_square',
  'urls',
  'description',
];

export default class Salon extends BaseService {

  constructor(config) {
    super(config, 'salon', 'beauty/salon/', { count: SALON_SEARCH_MAX_COUNT, order: SALON_SEARCH_ORDER });
  }

  read(req, resource, params, config) {
    const query = { ...params };
    if (query.page) {
      query.start = query.page * SALON_SEARCH_MAX_COUNT + 1;
    }

    delete query.page;
    return super.read(req, resource, query, config).then((results) => {
      const { salon: items, ...rest } = results;
      return {
        ...rest,
        salon: items.map(pick(PICK_PROPS)),
      };
    });
  }
}
