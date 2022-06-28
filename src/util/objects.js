export function isEmpty(obj) {
  return !obj ? true : Object.keys(obj).length === 0;
}