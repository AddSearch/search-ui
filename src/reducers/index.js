import { combineReducers } from 'redux';
import keyword from './keyword';
import search from './search';

const reducer = combineReducers({
  keyword,
  search
});

export default reducer;