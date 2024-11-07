export function roundDownToNearestTenth(num) {
  var len = Math.ceil(Math.log10(num + 1));
  if (len === 1) {
    return 0;
  }
  var tenthMultiplier = Math.pow(10, len - 1);
  return Math.floor(num / tenthMultiplier) * tenthMultiplier;
}

export function roundUpToNearestTenth(num) {
  var len = Math.ceil(Math.log10(num + 1));
  var tenthMultiplier = Math.pow(10, len - 1);
  return Math.ceil(num / tenthMultiplier) * tenthMultiplier;
}
