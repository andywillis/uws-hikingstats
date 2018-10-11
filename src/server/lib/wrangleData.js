const tj = require('togeojson');
const { DOMParser } = require('xmldom');

module.export = (arr) => {
  return arr.map((el) => {
    const gpx = new DOMParser().parseFromString(el);
    return tj.gpx(gpx);
  });
};
