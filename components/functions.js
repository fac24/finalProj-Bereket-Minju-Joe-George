const removeExcessUnderground = (point) => {
  return point.commonName
    .replace(" Underground Station", "")
    .replace(" Underground Stn", "");
};

module.exports = { removeExcessUnderground };
