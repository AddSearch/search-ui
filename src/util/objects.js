export function isEmpty(obj) {
  return !obj ? true : Object.keys(obj).length === 0;
}

export function toLowerKeys(obj) {
  if (!obj) return;
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}