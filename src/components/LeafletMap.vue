<template>
  <v-card id="map" class="map mx-auto mb-2" height="400"  max-width="600"></v-card>
</template>

<script>

import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import 'leaflet.fullscreen';
import '@bopen/leaflet-area-selection/dist/index.css';
import { DrawAreaSelection } from '@bopen/leaflet-area-selection';
import { createGrid, isSelfIntersecting, createPolygonFromBbox, getDimensions } from '../lib/utils';

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      gridGeoJson: {},
      selectedArea: null,
      areaSelection: null
    };
  },
  props: ['gridSize'],
  watch: {
    gridSize() {
      // console.log('gridsize changed, do something');
      this.updateGrid();
    }
  },
  methods: {
    setupMap() {
      const map = L.map('map', {
            center: [48.86, 2.34],
            zoom: 11,
            selectArea: true,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: 'topright',
              forceSeparateButton: true,
            }
      });
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {}
      ).addTo(map);
      L.control.scale({ imperial: false }).addTo(map);

      this.areaSelection = new DrawAreaSelection({
        active: false,
        onPolygonDblClick: this.updateGrid,
        onPolygonReady: this.onPolygonReady,
        onButtonDeactivate: this.clearAll,
        onButtonActivate: this.clearAll,

      });
      map.addControl(this.areaSelection);
      this.map = map;
    },
    clearGrid() {
      if (this.map.hasLayer(this.gridGeoJson)) {
        this.map.removeLayer(this.gridGeoJson);
        this.$emit('onAreaSelect', null);
      }
    },
    clearPolygon() {
      if (this.polygon && this.map.hasLayer(this.polygon)) {
        this.map.removeLayer(this.polygon);
      }
    },
    clearAll() {
      this.clearGrid();
      this.clearPolygon();
    },
    onManualCoordsChange(lat1, lng1, lat2, lng2) {
      // Test: 47.97911, 1.96983 48.2, 2.1
      // first clear the grid
      this.clearGrid();
      // clear old polygon
      this.clearPolygon();
      // create a new polygon if we have valid coordinates
      if (lat1 && lng1 && lat2 && lng2) {
        const customPoly = createPolygonFromBbox(lng1, lat1, lng2, lat2);  
        const customPolygon = L.geoJSON(customPoly, {color: 'green'});
        this.polygon = customPolygon.addTo(this.map);
        this.map.fitBounds(this.polygon.getBounds());
        // create custom grid
        const grid = createGrid(customPolygon.toGeoJSON(), this.gridSize);
        const gridstyle = {
          color: '#ffffff',
          weight: 1,
          opacity: 1,
          fillColor: '#ff0000', // square bg
          fillOpacity: 0.2 // square opacity
        }
        this.gridGeoJson = L.geoJSON(grid, { ...gridstyle }).setStyle(gridstyle);
        this.gridGeoJson.addTo(this.map);
        // send bbox coordinates to parent
        this.$emit('onAreaSelect', this.gridGeoJson.getBounds());
      }
    },
    onPolygonReady(aPolygon) {
      this.polygon = aPolygon;
    },
    updateGrid() {
      // remove old grid
      this.clearGrid();
      // polygon to GeoJSON
      const polygonGeoJSON = this.polygon.toGeoJSON();
      // check if the current polygon intersects with itself, if so, do nothing
      if (isSelfIntersecting(polygonGeoJSON)) {
        alert('The polygon must not overlap with itself, please fix!');
        return;
      }     
      // create grid
      const { grid, error } = createGrid(polygonGeoJSON, this.gridSize);
      if (error) {
        alert('An error has occurred. Check the grid size or the polygon shape.')
        return;
      }
      const gridstyle = {
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillColor: '#ff0000', // square bg
        fillOpacity: 0.2 // square opacity
      }
      this.gridGeoJson = L.geoJSON(grid, { ...gridstyle });
      this.gridGeoJson.addTo(this.map);
      // send bbox coordinates to parent
      this.$emit('onAreaSelect', this.gridGeoJson.getBounds())
    },
    jumpToCoordinate(lat,lon) {
      this.map.setView([lat, lon], 11);
    },
  },
  mounted() {
    this.setupMap();
  },
}

</script>