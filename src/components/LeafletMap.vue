<template>
  <v-card id="map" class="map mx-auto mb-2" height="400"  max-width="600"></v-card>
</template>

<script>

import * as L from 'leaflet';
import { geoJSON } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "@jonatanheyman/leaflet-areaselect";
import "@jonatanheyman/leaflet-areaselect/src/leaflet-areaselect.css";
import * as toGeoJson from '@mapbox/togeojson';
import screenfull from 'screenfull';

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      preview: {},
    };
  },
  methods: {
    setupMap() {
      const map = L.map('map', {
            center: [48.86, 2.34],
            zoom: 11,
            selectArea: true
      });
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {}
      ).addTo(map);
      L.control.scale({ imperial: false }).addTo(map);
      const areaSelect = L.areaSelect({
        width: 250,
        height: 210,
        keepAspectRatio: false
      });
      areaSelect.addTo(map);
      this.$emit('onAreaSelect', areaSelect.getBounds()); // initial call to fill the input fields
      const ref = this; // dirty hack, as arrow function seem not to work with areaSelect onChange Listener
      areaSelect.on("change", function() {
        ref.$emit('onAreaSelect', this.getBounds());
      });
      // add fullscreen button
      const fullscreenControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        onAdd: () => {
          const button = L.DomUtil.create(
            'button',
            'fullscreen-button'
          );
          button.title = 'Toggle Fullscreen';
          L.DomEvent.disableClickPropagation(button);      
          L.DomEvent.on(button, 'click', () => {
            ref.toggleFullscreen();
          })
          return button;
        }
      });
      const fullscreenButton = new fullscreenControl();      
      fullscreenButton.addTo(map);

      this.map = map;
    },
    previewGrid(kml) { 
      const kmlParsed = new DOMParser().parseFromString(kml, 'text/xml');
      const geoJson = toGeoJson.kml(kmlParsed);
      console.log(geoJson);
      if (this.preview) {
        this.map.removeLayer(this.preview);
      }      
      this.preview = geoJSON(geoJson).addTo(this.map);
    },
    toggleFullscreen() {
      if (screenfull.isEnabled) {
        const aMap = document.getElementById('map');
        screenfull.toggle(aMap);
      }
    },
    jumpToCoordinate(lat,lon) {
      this.map.setView([lat, lon], 11);
    }
  },
  mounted() {
    this.setupMap();
  },
}

</script>