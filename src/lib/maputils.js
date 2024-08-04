import * as turf from '@turf/turf';
import { toKML } from 'geokml';

// check if polygon has self-intersections
export const hasIntersection = (drawing) => {
    // drawing is a leaflet L.polygon and turf needs GeoJSON
    const geojson = drawing.toGeoJSON();
    const kinks = turf.kinks(geojson);
    return kinks.features.length > 0;
};

const getGridSizeInDegrees = (lat, gridSizeKm) => {
    // Convert grid size to degrees for a given latitude & gridsize in km
    const degPerKm = 1 / 111; // Approximate value for one degree of latitude in km
    const latStep = gridSizeKm * degPerKm;
    const lonStep = (gridSizeKm * degPerKm) / Math.cos((lat * Math.PI) / 180);
    return { gridWithInDeg: lonStep, gridHeightInDeg: latStep };
};

export const createGrid = (drawing, gridSize, map) => {
    // drawing is a leaflet L.polygon and turf needs GeoJSON
    const geojson = drawing.toGeoJSON();

    // create a reactangle polygon based on the bounding box of the drawing
    const box = turf.bboxPolygon(turf.bbox(geojson));
    // L.geoJSON(box, { color: 'red' }).addTo(map);

    // to always get a good grid cover of the drawing shape, we scale
    // the box up by a factor of 1.5
    const boxScaled = turf.transformScale(box, 1.5);
    // L.geoJSON(boxScaled, { color: 'green' }).addTo(map);

    // based on the latitude of the drawing on the map, we need to convert
    // the given grid size (in km) to degrees for further calculations
    // For that we first must get the the mid latitude of the drawing
    const scaledBbox = turf.bbox(boxScaled);
    const [west, south, east, north] = scaledBbox;
    const minLatitude = south; // Minimum latitude
    const maxLatitude = north; // Maximum latitude
    const midLatitude = (minLatitude + maxLatitude) / 2;
    const { gridWithInDeg, gridHeightInDeg } = getGridSizeInDegrees(
        midLatitude,
        gridSize,
    );

    // get the dimension of the scaled polygon in degrees
    const polyWidthInDeg = east - west; // diff in longitude
    const polyHeightInDeg = north - south; // diff in latitude

    // if the gridsize is too big, meaning the grid is wider or
    // higher than the scaled box, return an error
    if (gridWithInDeg > polyWidthInDeg || gridHeightInDeg > polyHeightInDeg) {
        return {
            grid: null,
            error: true,
            msg: 'Grid size is too big. Please choose a lower one.',
        };
    }

    // we also don't want huge areas with a tiny gridsize, as this results in
    // massive grid which brings leaflet to its knees, and subsequently the browser.
    // Therefore a basic check here - calculate the grid area and compare to the
    // bounding box of the drawing area, so we get a feeling hoe many grids would
    //  be needed to cover the drawing.
    // For that we use the turf.area method, that return the area of a feature in square meters
    const gridArea = (gridSize * 1000) ** 2;
    // console.log(`A single grid has an area of ${gridArea} square meter`);
    const drawingArea = turf.area(box);
    // console.log(`The drawing has an area of ${drawingArea} square meter`);
    const gridsNeeded = (drawingArea / gridArea).toFixed(3);
    // console.log(`Approx. ${gridsNeeded} needed to cover that area`);
    if (gridsNeeded >= 10000) {
        return {
            grid: null,
            error: true,
            msg: 'Grid size too small for the given area. Please choose a higher one.',
        };
    }

    // now create the grid on the scaled box and mask it with
    // the original drawing polygon
    const gridOptions = { units: 'degrees', mask: geojson };
    const grid = turf.rectangleGrid(
        scaledBbox,
        gridWithInDeg,
        gridHeightInDeg,
        gridOptions,
    );
    // L.geoJSON(grid, { color: 'blue' }).addTo(map);

    return { grid: grid, error: false };
};

export const createKML = (geojson) => {
    let kml = toKML(geojson, {
        documentName: 'Grid',
        documentDescription: 'Search Grid',
    });
    const lineStyle =
        '<LineStyle><color>ffffffff</color><width>3</width></LineStyle>';
    const squareStyle =
        '<PolyStyle><color>000000ff</color><fill>1</fill></PolyStyle>';
    const style = `<Style id="myDefaultStyles">${lineStyle}${squareStyle}</Style>`;
    kml = kml.replace('<Document>', `<Document>${style}`);
    kml = kml.replaceAll(
        '<Placemark>',
        `<Placemark><styleUrl>#myDefaultStyles</styleUrl>`,
    );
    return kml;
};
