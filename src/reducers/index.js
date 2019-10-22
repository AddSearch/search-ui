import { combineReducers } from 'redux';
import filters from './filters';
import keyword from './keyword';
import search from './search';

const reducer = combineReducers({
  filters,
  keyword,
  search
});

export default reducer;