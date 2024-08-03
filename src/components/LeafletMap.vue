<template>
  <v-card id="map" class="map mx-auto mb-2" height="400"  max-width="600"></v-card>
</template>

<script>

import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import 'leaflet.fullscreen';
import '@bopen/leaflet-area-selection/dist/index.css';
import { DrawAreaSelection } from '@bopen/leaflet-area-selection';
import { createGrid } from '../lib/utils';


export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      gridGeoJson: {},
      selectedArea: null
    };
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

      const areaSelection = new DrawAreaSelection({
        // onPolygonReady: this.onPolygonReady,
        onPolygonDblClick: this.onPolygonDblClick
      });
      map.addControl(areaSelection);
      this.map = map;
    },
    onPolygonDblClick(aPolygon) {
      // remove old grid
      if (this.map.hasLayer(this.gridGeoJson)) {
        this.map.removeLayer(this.gridGeoJson);
      }
      // polygon to GeoJSON
      const polygonGeoJSON = aPolygon.toGeoJSON();
      const grid = createGrid(polygonGeoJSON);
      const gridstyle = {
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillColor: '#ff0000', // square bg
        fillOpacity: 0.2 // square opacity
      }
      this.gridGeoJson = L.geoJSON(grid, { ...gridstyle }).setStyle(gridstyle);
      this.gridGeoJson.addTo(this.map);


    },
    // async toggleFullscreen() {
    //   if (screenfull.isEnabled) {
    //     const aMap = document.getElementById('map');
    //     console.log(screenfull.isFullscreen, this.selectedArea)
    //     await screenfull.toggle(aMap);
    //     console.log(screenfull.isFullscreen, this.selectedArea)
    //     if (!screenfull.isFullscreen) {
    //       this.map.fitBounds(this.selectedArea);
    //     }
    //   }
    // },
    jumpToCoordinate(lat,lon) {
      this.map.setView([lat, lon], 11);
    },
  },
  mounted() {
    this.setupMap();
  },
}

</script>