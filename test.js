const fs = require("fs");
const test = require("ava");
const fetch = require("cross-fetch");

const geoFileType = require("./geo-file-type");

test("detect large ascii grids", t => {
  const debug = false;
  const filepath = "./data/michigan_lld/michigan_lld.asc";
  t.is(geoFileType({ data: filepath, debug }).type, "ASCII Grid");
  const buffer = fs.readFileSync(filepath);
  t.is(geoFileType({ data: buffer, debug }).type, "ASCII Grid");
  t.is(
    geoFileType({ data: Uint8Array.from(buffer), debug }).type,
    "ASCII Grid"
  );
});

test("detect Cloud Optimized GeoTIFFs", async t => {
  const debug = false;
  const url =
    "https://s3-us-west-2.amazonaws.com/planet-disaster-data/hurricane-harvey/SkySat_Freeport_s03_20170831T162740Z3.tif";
  const headers = { Range: "bytes=0-1000" };
  const response = await fetch(url, { headers });
  const arrayBuffer = await response.arrayBuffer();
  const result = geoFileType({ data: arrayBuffer, debug });
  t.is(result.type, "Cloud Optimized GeoTIFF");
});

test("detect normal GeoTIFFs (not cloud optimized)", async t => {
  const debug = false;
  const buffer = fs.readFileSync("./data/example_4326.tif");
  const result = geoFileType({ data: buffer, debug });
  t.is(result.type, "GeoTIFF");
});

test("detect GeoTIFF without geospatial metadata", async t => {
  const debug = false;
  const buffer = fs.readFileSync("./data/flower.tif");
  const result = geoFileType({ data: buffer, debug });
  t.is(result.type, "TIFF");
});

test("detect JPG", async t => {
  const debug = false;
  const buffer = fs.readFileSync("./data/flower.jpg");
  const result = geoFileType({ data: buffer, debug });
  t.is(result.type, "JPEG");
});

test("detect PNG", async t => {
  const debug = false;
  const buffer = fs.readFileSync("./data/flower.png");
  const result = geoFileType({ data: buffer, debug });
  t.is(result.type, "PNG");
});

test("detect AUX XML", async t => {
  const debug = false;
  const buffer = fs.readFileSync("./data/test.png.aux.xml");
  const result = geoFileType({ data: buffer, debug });
  t.is(result.type, "Auxiliary XML File");
});

test("detect SHP file", async t => {
  const debug = false;
  const buffer = fs.readFileSync("./data/chattanooga.shp");
  const result = geoFileType({ data: buffer, debug });
  t.is(result.type, "SHP (Shapefile)");
});
