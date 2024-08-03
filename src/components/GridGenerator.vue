<template>
  <v-app>
    <v-container>
      <v-responsive class="align-center text-center overflow-visible">
        <v-img height="100" src="@/assets/logo.svg" />
        <h1 class="py-2 font-weight-bold">Bellingcat Search Grid Generator</h1>
        <a href="https://www.bellingcat.com"
          ><img
            alt="Bellingcat logo: Discover Bellingcat"
            src="https://img.shields.io/badge/Discover%20Bellingcat-%20?style=for-the-badge&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TS0UqDnZQEcxQneyiIo6likWwUNoKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ%2FABxdnBSdJES%2F5cUWsR4cNyPd%2Fced%2B8AoVllqtkTA1TNMtKJuJjLr4rBVwQwhhBEDEvM1JOZxSw8x9c9fHy9i%2FIs73N%2Fjn6lYDLAJxLHmG5YxBvEs5uWznmfOMzKkkJ8Tjxp0AWJH7kuu%2FzGueSwwDPDRjY9TxwmFktdLHcxKxsq8QxxRFE1yhdyLiuctzir1Tpr35O%2FMFTQVjJcpzmKBJaQRIo6klFHBVVYiNKqkWIiTftxD%2F%2BI40%2BRSyZXBYwcC6hBheT4wf%2Fgd7dmcXrKTQrFgcCLbX%2BMA8FdoNWw7e9j226dAP5n4Err%2BGtNYO6T9EZHixwBA9vAxXVHk%2FeAyx1g6EmXDMmR%2FDSFYhF4P6NvygODt0Dfmttbex%2BnD0CWulq%2BAQ4OgYkSZa97vLu3u7d%2Fz7T7%2BwHEU3LHAa%2FQ6gAAAAZiS0dEAAAAAAAA%2BUO7fwAAAAlwSFlzAAAuIwAALiMBeKU%2FdgAAAAd0SU1FB%2BgFHwwiMH4odB4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA50lEQVQ4y82SvWpCQRCFz25ERSJiCNqlUiS1b5AuEEiZIq1NOsGXCKms0wXSp9T6dskDiFikyiPc%2FrMZyf3FXSGQ0%2BzuzPl2ZoeVKgQ0gQ2wBVpVHlcDkjM5V%2FJ5nag6sJ%2FZX%2Bh%2FC7gEhqeAFKf7p1M9aB3b5oN1OomB7g1axUBPBr3GQHODHmOgqUF3MZAzKI2d4LWBV4H%2BMXDuJd1a7Cew1k7SwksaHC4LqNaw7aeX9GWHXkC1G1sTAS17Y3Kk2lnp4wNLiz0DrgLq8qt2MfmSSabAO%2FBBXp26dtrADPjOmN%2BAUdG7B3cE61l5hOZiAAAAAElFTkSuQmCC&logoColor=%23fff&color=%23000" /></a
        ><!--
          --><a href="https://discord.gg/bellingcat"
          ><img
            alt="Discord logo: Join our community"
            src="https://img.shields.io/badge/Join%20our%20community-%20?style=for-the-badge&logo=discord&logoColor=%23fff&color=%235865F2" /></a
        ><!--
          --><a href="https://github.com/bellingcat/search-grid-generator"
          ><img
            alt="Github logo: Explore the code"
            src="https://img.shields.io/badge/Explore%20the%20code-%20?style=for-the-badge&logo=github&color=%2329903b"
        /></a>
        <!-- Title and Information -->
        <v-card class="mx-auto" max-width="600" variant="text">
          <p class="py-2">
            Use the map to select an area of interest. Optionally adjust the
            grid size and file name. Click the 'Download Search Grid' button to
            download your KML file. This KML file can be opened in Google Earth
            or other GIS tool.
          </p>
        </v-card>
        <v-card class="mx-auto mb-2" max-width="600" max-height="350" @ready="readyMap()">
          <!-- Add a small input field with arrow icon for lat long-->
          <v-text-field
            hide-details="true"
            label="Jump to coordinate (lat, lon)"
            placeholder="48.86, 2.34"
            v-model="mapCenter"
            :append-inner-icon="'mdi-target'"
            type="text"
            density="compact"
            @click:append-inner="jumpToCoordinate()"
            @keydown.enter="jumpToCoordinate()"
          ></v-text-field>
        </v-card>
        <LeafletMap ref="leafletMap" @onAreaSelect="onAreaSelect" />
        <!-- <v-card id="map" class="map mx-auto mb-2" height="400"  max-width="600"></v-card> -->
        <v-card class="mx-auto" max-width="600">
          <v-card-text>
            <v-form v-model="isFormValid">
              <v-row class="px-3 pb-5 pt-1">
              <v-text-field
                class="pr-1"
                v-model="coordinates1"
                label="Coordinate 1 (lat, lon)"
                placeholder="48.90529373066811, 2.2584719879516464"
                outlined
                :rules="[(v) => !!v]"
                density="compact"
                hide-details="true"
              ></v-text-field>
              <v-text-field
              class="pl-1"
                v-model="coordinates2"
                label="Coordinate 2 (lat, lon)"
                placeholder="48.81418021233939, 2.4172392962309246"
                outlined
                :rules="[(v) => !!v]"
                density="compact"
                hide-details="true"
              ></v-text-field>
            </v-row>
              <v-text-field
                v-model.number="gridSize"
                label="Grid Size (km)"
                placeholder="1"
                outlined
                type="number"
                step="0.1"
                :rules="[(v) => v > 0 || 'Grid size must be greater than 0']"
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model="fileName"
                label="File Name"
                placeholder="grid.kml"
                outlined
                density="compact"
                hide-details="true"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn

              variant="elevated"
              color="primary"
              @click="downloadKML"
              >Download Search Grid</v-btn
            >          
          </v-card-actions>
        </v-card>
      </v-responsive>
    </v-container>
  </v-app>
</template>

<script>
import LeafletMap from './LeafletMap'
import { createKML } from '../lib/utils';


export default {
  components: {
    LeafletMap
  },
  data() {
    return {
      isFormValid: true,
      lat1: null,
      lon1: null,
      lat2: null,
      lon2: null,
      gridSize: 1,
      fileName: "grid.kml",
      areaSelect: null,
      mapCenter: null,
      map: null
    };
  },
  computed: {
    coordinates1: {
      get() {
        if (!this.lat1 || !this.lon1) {
          return;
        }
        return `${this.lat1}, ${this.lon1}`;
      },
      set(value) {
        const [lat, lon] = value.split(",").map(Number);
        this.lat1 = lat;
        this.lon1 = lon;
        this.$refs.leafletMap.onManualCoordsChange(this.lat2,this.lon2,this.lat1,this.lon1);
      },
    },
    coordinates2: {
      get() {
        if (!this.lat2 || !this.lon2) {
          return;
        }
        return `${this.lat2}, ${this.lon2}`;
      },
      set(value) {
        const [lat, lon] = value.split(",").map(Number);
        this.lat2 = lat;
        this.lon2 = lon;
        this.$refs.leafletMap.onManualCoordsChange(this.lat2,this.lon2,this.lat1,this.lon1);
      },
    },
  },
  methods: {
    onAreaSelect(bounds) {
      if (!bounds) {
        this.lat1 = null;
        this.lon1 = null;
        this.lat2 = null;
        this.lon2 = null;
      } else {
        this.lat1 = bounds.getNorthEast().lat.toFixed(5);
        this.lon1 = bounds.getNorthEast().lng.toFixed(5);
        this.lat2 = bounds.getSouthWest().lat.toFixed(5);
        this.lon2 = bounds.getSouthWest().lng.toFixed(5);
      }
    },
    downloadKML() {

      // get gridgeojson
      const gridGeoJson = this.$refs.leafletMap.gridGeoJson;
      // convert to kml
      const style = {
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillColor: '#ff0000', // square bg
        fillOpacity: 0.2 // square opacity
      };
      const foo = gridGeoJson.setStyle(style).toGeoJSON();
      console.log(foo);
      const kml = createKML(gridGeoJson.toGeoJSON());
      console.log(kml);


      // Create a Blob with the KML data
      const blob = new Blob([kml], {
        type: "application/vnd.google-earth.kml+xml",
      });
      const url = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = 'grid.kml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the object URL
      URL.revokeObjectURL(url);
    },
    previewGrid() {
      const kml = this.generateKML();
      return kml;
      // this.$refs.leafletMap.previewGrid(kml);
    },
    jumpToCoordinate() {

      if (!this.mapCenter) {
        return;
      }
      const [lat, lon] = this.mapCenter.split(",").map(Number);
      this.$refs.leafletMap.jumpToCoordinate(lat,lon);
    },
  },
};
</script>
