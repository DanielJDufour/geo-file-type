const isAsciiGrid = require("ascii-grid/src/is-ascii-grid");
const isAuxXML = require("aux-xml/is-aux-xml");
const isCOG = require("is-cog");
const isJPG = require("id-jpg");
const isGeoTIFF = require("is-geotiff");
const isWorldFile = require("is-wld");
const isPNG = require("id-png");
const isSHP = require("is-shp");
const isTIF = require("id-tif");

const {
  ASC,
  AUX_XML,
  COG,
  GEOTIFF,
  JPG,
  PNG,
  SHP,
  TIF,
  WLD
} = require("./constants");

function identify({ data, debug }) {
  if (debug) console.log("[geo-file-type] starting identify with:", data);

  let fileType;

  // works with many different types of data
  // so try that first
  if (isWorldFile(data)) {
    fileType = WLD;
  } else if (isAsciiGrid(data, { debug })) {
    fileType = ASC;
  } else if (isPNG(data)) {
    fileType = PNG;
  } else if (isJPG(data)) {
    fileType = JPG;    
  } else if (isAuxXML(data, debug)) {
    fileType = AUX_XML;
  } else if (isSHP({ data, debug }).result) {
    fileType = SHP;
  } else if (isTIF(data)) {
    if (debug) console.log("[geo-file-type] input is a TIFF");
    fileType = TIF;
    if (isGeoTIFF({ data, debug }).result) {
      fileType = GEOTIFF;
      if (isCOG({ data, debug }).is_cog) {
        fileType = COG;
      }
    }
  } else if (typeof data === "object" && data.data && data.metadata) {
    return "Simple Object";
  }

  const result = { type: fileType };
  if (debug) console.log("[geo-file-type] returning", result);
  return result;
}

module.exports = identify;
