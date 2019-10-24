import { combineReducers } from 'redux';
import filters from './filters';
import keyword from './keyword';
import pagination from './pagination';
import search from './search';

const reducer = combineReducers({
  filters,
  keyword,
  pagination,
  search
});

export default reducer;