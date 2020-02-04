import { combineReducers } from 'redux';
import autocomplete from './autocomplete';
import filters from './filters';
import keyword from './keyword';
import pagination from './pagination';
import search from './search';
import segmentedsearch from './segmentedsearch';
import sortby from './sortby';

const reducer = combineReducers({
  autocomplete,
  filters,
  keyword,
  pagination,
  search,
  segmentedsearch,
  sortby
});

export default reducer;