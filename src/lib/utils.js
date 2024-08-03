import * as L from 'leaflet';
import * as turf from "@turf/turf";
import { toKML } from 'geokml';

const isSelfIntersecting = (polygonGeoJSON) => {
  const kinks = turf.kinks(polygonGeoJSON);
  return kinks.features.length > 0;
}

const createPolygonFromBbox = (lat1, lng1, lat2, lng2) => {
  return turf.bboxPolygon([lat1, lng1, lat2, lng2]);
}
const createGrid = (polygonGeoJSON) => {
      // get polygon bbox
      const polygonBbox = turf.bbox(polygonGeoJSON);
      // create polygon from bbox
      const bboxPolygon = turf.bboxPolygon(polygonBbox);
      // L.geoJSON(bboxPolygon, {color: 'green'}).addTo(this.map);
      // scale up
      const bboxPolygonScaled = turf.transformScale(bboxPolygon, 1.5);
      const bboxPolygonScaledGeoJson = L.geoJSON(bboxPolygonScaled, {color: 'yellow'});
      // bboxPolygonScaledGeoJson.addTo(this.map);
      // get lats
      const lat1 = bboxPolygonScaledGeoJson.getBounds().getNorthEast().lat;
      const lat2 = bboxPolygonScaledGeoJson.getBounds().getSouthWest().lat;
      // options
      const gridSizeKm = 1;
      const options = { units: "degrees", mask: polygonGeoJSON };
      // Convert grid size to degrees
      const degPerKm = 1 / 111; // Approximate value for one degree of latitude in km
      const midLat = (lat1 + lat2) / 2;
      const latStep = gridSizeKm * degPerKm;
      const lonStep =
        (gridSizeKm * degPerKm) / Math.cos((midLat * Math.PI) / 180);
      // create grid from scaled polygon bbox
      const scaledBbox = turf.bbox(bboxPolygonScaled);
      const reactangleGrid = turf.rectangleGrid(scaledBbox, lonStep, latStep, options);
      // TODO: intersect
      // return
      return reactangleGrid;
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

export { createKML, createGrid, isSelfIntersecting, createPolygonFromBbox };