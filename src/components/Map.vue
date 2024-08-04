<template>
    <v-alert
        v-model="state.isAlertVisible"
        :type="state.alertType"
        class="map mx-auto mb-2"
        max-width="600"
        density="“compact”:"
        >{{ state.alertMessage }}
    </v-alert>
    <v-card
        id="map"
        class="map mx-auto mb-2"
        height="400"
        max-width="600"
    ></v-card>
</template>

<script setup>
import { watch, reactive, onMounted } from 'vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.fullscreen';
import '@bopen/leaflet-area-selection/dist/index.css';
import { DrawAreaSelection } from '@bopen/leaflet-area-selection';
import { useGridSizeStore } from '@/stores/gridSizeStore';
import { useJumpStore } from '@/stores/jumpStore';
import { useMapStore } from '@/stores/mapStore';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
import * as mapUtils from '../lib/maputils';

const gridSizeStore = useGridSizeStore();
const jumpStore = useJumpStore();
const mapStore = useMapStore();
const coordinatesStore = useCoordinatesStore();

// reactive variables
const state = reactive({
    map: null,
    drawing: {},
    grid: {},
    isAlertVisible: false,
    alertMessage: '',
    alertType: '',
    isCustomPoly: false,
});

// watch for grid size change
watch(
    () => gridSizeStore.gridValue,
    (newValue, oldValue) => {
        // console.log(`Slider value changed from ${oldValue} to ${newValue}`);
        updateGrid();
    },
);

// watch for coordinates jumper change
watch(
    () => jumpStore.point,
    (newPoint, oldPoint) => {
        // console.log(`jumper point changed from ${oldPoint} to ${newPoint}`);
        // just a quick&dirty check as we expect the store value to be in correct format
        if (newPoint === '' || !newPoint) {
            return;
        }
        const [lat, lng] = newPoint.split(',');
        // center map on new location, but also clear the map
        state.map.setView([lat, lng]);
        clearAll();
    },
);

// watch for coordinates input change
watch(
    () => coordinatesStore.coordinates,
    (newCoordinates, oldCoordinates) => {
        // console.log('Object changed:', JSON.stringify(newCoordinates));
        // if booth are not null, clean map, create new drawing based on given coordinates
        const { c1, c2 } = newCoordinates;
        if (c1 !== '' && c2 !== '') {
            console.log('received 2 valid coordinates, draw a new polygon');
            const p1 = c1.split(',');
            const p2 = c2.split(',');
            onCustomCoordinates(p1, p2);
        }
    },
    { deep: true },
);

// add the map when the component is mounted
onMounted(() => {
    // init the map
    const map = L.map('map', {
        // default center
        center: [48.86, 2.34],
        // default zoom level
        zoom: 11,
        // auto add the fullscreen functionality
        fullscreenControl: true,
        // set some fullscreen options
        fullscreenControlOptions: {
            position: 'topright',
            forceSeparateButton: true,
        },
    });

    // define the tilelayer and add to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
        map,
    );

    // add the scale to the map
    L.control.scale({ imperial: false }).addTo(map);

    // setup the area selection
    const areaSelection = new DrawAreaSelection({
        active: false,
        onPolygonDblClick: updateGrid,
        onPolygonReady: onPolygonReady,
        onButtonDeactivate: onButtonDeactivate,
        onButtonActivate: onButtonActivate,
    });

    // detect drag (end) of the map, clears the point input field in Jumper
    map.on('dragend', (event) => {
        // console.log('drag end, reset point');
        jumpStore.setPoint('');
    });
    // add area selection to the map
    map.addControl(areaSelection);

    // to ref
    state.map = map;
});

const showAlert = (type, message) => {
    state.alertType = type;
    state.alertMessage = message;
    state.isAlertVisible = true;
};
const hideAlert = () => {
    state.alertType = '';
    state.alertMessage = '';
    state.isAlertVisible = false;
};

// removes the grid preview layer from the map
const clearGrid = () => {
    if (state.map.hasLayer(state.grid)) {
        state.map.removeLayer(state.grid);
    }
};

// removes the drawn polygon from the map
const clearDrawing = () => {
    if (state.map.hasLayer(state.drawing)) {
        state.map.removeLayer(state.drawing);
    }
};

const onButtonDeactivate = () => {
    // if we have a custom poly, reset the value
    if (state.isCustomPoly) {
        coordinatesStore.clearCoordinates();
        state.isCustomPoly = false;
    }
    clearAll();
};
const onButtonActivate = () => {
    // if we have a custom poly, reset the value
    if (state.isCustomPoly) {
        coordinatesStore.clearCoordinates();
        state.isCustomPoly = false;
    }
    clearAll();
};

// clears the map of all our layers
const clearAll = () => {
    // console.log(state.map);
    clearDrawing();
    clearGrid();
    // also clear grid in the map store
    mapStore.updateGrid(null);
    mapStore.updateIsPoly(false);
    // reset custom coordinates
    // TODO: only if we need to
    // coordinatesStore.clearCoordinates();
};

// callback called during the adjustment phase every time a change is performed to the polygon
// Receives the Leaflet.Polygon and the control instance as arguments.
const onPolygonReady = (polygon) => {
    state.drawing = polygon; // update the state with the current polygon
};

// if we receive 2 valid coordinates from the form input
// clean the map, draw new polygon and update grid
const onCustomCoordinates = (c1, c2) => {
    // clean map
    clearAll();
    // create polygon from coordinates
    const customPolygon = mapUtils.createPolygonFromCoordinates(c1, c2);
    const geojson = L.geoJSON(customPolygon, { color: 'blue' });
    geojson.addTo(state.map);
    state.map.fitBounds(geojson.getBounds());
    state.drawing = geojson;
    // set local state
    state.isCustomPoly = true;
    // create grid
    updateGrid();
};

// called when performing a double-click on the draw polygon when in the adjustment phase
// Receives three arguments: the Leaflet.Polygon, the control instance and the event.
const updateGrid = () => {
    // remove old grid
    clearGrid();
    // update map store
    mapStore.updateIsPoly(true);
    // check for polygon intersection
    if (mapUtils.hasIntersection(state.drawing)) {
        showAlert(
            'warning',
            'The polygon must not overlap with itself, please fix!',
        );
        return;
    }
    if (state.isAlertVisible) {
        hideAlert();
    }
    // now create the grid
    const { gridValue } = gridSizeStore;
    const { grid, error, msg } = mapUtils.createGrid(
        state.drawing,
        gridValue,
        state.map,
    );
    if (error) {
        showAlert('warning', msg);
        return;
    }
    if (state.isAlertVisible) {
        hideAlert();
    }
    // if we have no error and a good grid, at to state
    // and display the grid
    const gridstyle = {
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillColor: '#ff0000', // square bg
        fillOpacity: 0.2, // square opacity
    };
    state.grid = L.geoJSON(grid).setStyle(gridstyle).addTo(state.map);
    // also update the global store so other components can access the grid
    mapStore.updateGrid(grid);
};
</script>
