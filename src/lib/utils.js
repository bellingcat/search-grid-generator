import * as L from 'leaflet';
import * as turf from "@turf/turf";
import { toKML } from 'geokml';

const isSelfIntersecting = (polygonGeoJSON) => {
  const kinks = turf.kinks(polygonGeoJSON);
  return kinks.features.length > 0;
}

const getDimensions = (poly) => {
  const bounds = poly.getBounds();
  const west = bounds.getWest();
  const east = bounds.getEast();
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  const widthInDegrees = east - west;
  const heightInDegrees = north - south;
  return { w: widthInDegrees, h: heightInDegrees };
}

const getGridSizeInDegrees = (lat, gridSizeKm) => {
  // Convert grid size to degrees for a given latitude & gridsize in km
  const degPerKm = 1 / 111; // Approximate value for one degree of latitude in km
  const latStep = gridSizeKm * degPerKm;
  const lonStep = (gridSizeKm * degPerKm) / Math.cos((lat * Math.PI) / 180);
  return { latStep, lonStep }
}

const createPolygonFromBbox = (lat1, lng1, lat2, lng2) => {
  return turf.bboxPolygon([lat1, lng1, lat2, lng2]);
}
const createGrid = (polygonGeoJSON, gridSizeKm) => {
  // get polygon bbox
  const polygonBbox = turf.bbox(polygonGeoJSON);
  // create polygon from bbox
  const bboxPolygon = turf.bboxPolygon(polygonBbox);
  // L.geoJSON(bboxPolygon, {color: 'green'}).addTo(this.map);
  // scale up
  const bboxPolygonScaled = turf.transformScale(bboxPolygon, 1.5);
  const bboxPolygonScaledGeoJson = L.geoJSON(bboxPolygonScaled, {color: 'yellow'});
  // bboxPolygonScaledGeoJson.addTo(map);
  // get lats
  const lat1 = bboxPolygonScaledGeoJson.getBounds().getNorthEast().lat;
  const lat2 = bboxPolygonScaledGeoJson.getBounds().getSouthWest().lat;
  // options
  const options = { units: "degrees", mask: polygonGeoJSON };
  // Convert grid size to degrees
  const midLat = (lat1 + lat2) / 2;
  const { latStep, lonStep } = getGridSizeInDegrees(midLat, gridSizeKm)

  // get the dimension of the scaled polygon in degrees
  const {w,h} = getDimensions(L.geoJSON(bboxPolygon));
  // console.log(w,h,latStep,lonStep);
  if (h < latStep || w < lonStep) {
    // console.log('############## gridsize zu groß!!!!');
    return { grid: null, error: true };
  }


  // create grid from scaled polygon bbox
  const scaledBbox = turf.bbox(bboxPolygonScaled);
  const reactangleGrid = turf.rectangleGrid(scaledBbox, lonStep, latStep, options);
  // TODO: intersect
  // return
  return { grid: reactangleGrid, error: false };
}

const createKML = (geojson) => {
  let kml = toKML(geojson, {
    documentName: 'Grid',
    documentDescription: 'Search Grid',
  });
  const lineStyle = "<LineStyle><color>ffffffff</color><width>3</width></LineStyle>";
  const squareStyle = "<PolyStyle><color>000000ff</color><fill>1</fill></PolyStyle>";
  const style = `<Style id="myDefaultStyles">${lineStyle}${squareStyle}</Style>`;
  kml = kml.replace('<Document>', `<Document>${style}`);
  kml = kml.replaceAll('<Placemark>', `<Placemark><styleUrl>#myDefaultStyles</styleUrl>`);
  return kml;
}

export { createKML, createGrid, isSelfIntersecting, createPolygonFromBbox, getDimensions };