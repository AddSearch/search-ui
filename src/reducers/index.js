import { combineReducers } from 'redux';
import filters from './filters';
import keyword from './keyword';
import pagination from './pagination';
import search from './search';
import sortby from './sortby';

const reducer = combineReducers({
  filters,
  keyword,
  pagination,
  search,
  sortby
});

export default reducer;