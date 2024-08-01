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
            Generate a search grid by entering coordinates for opposite corners
            of an area of interest. The KML file can be opened in Google Earth
            or other GIS tool.
          </p>
        </v-card>
        <v-card class="mx-auto mb-2" max-width="600" max-height="350">
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
          <l-map
            ref="map"
            :use-global-leaflet="false"
            style="z-index: 0; height: 300px; width: 100%;"
            @ready="readyMap()"
          />
        </v-card>
        <v-card class="mx-auto" max-width="600">
          <v-card-text>
            <v-form v-model="isFormValid">
              <v-text-field
                v-model="coordinates1"
                label="Coordinate 1 (lat, lon)"
                placeholder="48.90529373066811, 2.2584719879516464"
                outlined
                :rules="[(v) => !!v]"
              ></v-text-field>
              <v-text-field
                v-model="coordinates2"
                label="Coordinate 2 (lat, lon)"
                placeholder="48.81418021233939, 2.4172392962309246"
                outlined
                :rules="[(v) => !!v]"
              ></v-text-field>
              <v-text-field
                v-model.number="gridSize"
                label="Grid Size (km)"
                placeholder="1"
                outlined
                type="number"
                step="0.1"
                :rules="[(v) => v > 0 || 'Grid size must be greater than 0']"
              ></v-text-field>
              <v-text-field
                v-model="fileName"
                label="File Name"
                placeholder="grid.kml"
                outlined
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!isFormValid"
              variant="elevated"
              color="primary"
              @click="generateKML"
              >Generate KML</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-responsive>
    </v-container>
  </v-app>
</template>

<script>
import { create } from "xmlbuilder2";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import "@jonatanheyman/leaflet-areaselect";
import "@jonatanheyman/leaflet-areaselect/src/leaflet-areaselect.css";

export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      isFormValid: false,
      lat1: 48.90529373066811,
      lon1: 2.2584719879516464,
      lat2: 48.81418021233939,
      lon2: 2.4172392962309246,
      gridSize: 1,
      fileName: "grid.kml",
      areaSelect: null,
      mapCenter: null
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
      },
    },
  },
  methods: {
    generateKML() {
      if (
        !this.lat1 ||
        !this.lon1 ||
        !this.lat2 ||
        !this.lon2 ||
        this.gridSize <= 0
      ) {
        return;
      }
      var fileName = this.fileName;
      fileName = (!fileName) ? "grid.kml" : fileName;
      this.fileName = fileName.endsWith(".kml")
        ? fileName
        : `${fileName}.kml`;

      const [lat1, lon1, lat2, lon2] = [
        this.lat1,
        this.lon1,
        this.lat2,
        this.lon2,
      ].map(Number);

      const gridSizeKm = this.gridSize;

      // Convert grid size to degrees
      const degPerKm = 1 / 111; // Approximate value for one degree of latitude in km
      const midLat = (lat1 + lat2) / 2;
      const latStep = gridSizeKm * degPerKm;
      const lonStep =
        (gridSizeKm * degPerKm) / Math.cos((midLat * Math.PI) / 180);

      // Initialize KML document
      const kmlDoc = create({ version: "1.0", encoding: "UTF-8" })
        .ele("kml", { xmlns: "http://www.opengis.net/kml/2.2" })
        .ele("Document")
        .ele("name")
        .txt("Grid")
        .up()
        .ele("Style", { id: "1" })
        .ele("LineStyle", { id: "2" })
        .ele("color")
        .txt("ffffffff")
        .up()
        .ele("colorMode")
        .txt("normal")
        .up()
        .ele("width")
        .txt("2")
        .up()
        .up()
        .ele("PolyStyle", { id: "3" })
        .ele("color")
        .txt("000000ff")
        .up()
        .ele("colorMode")
        .txt("normal")
        .up()
        .ele("fill")
        .txt("1")
        .up()
        .ele("outline")
        .txt("1")
        .up()
        .up()
        .up();

      for (
        let lat = Math.min(lat1, lat2);
        lat < Math.max(lat1, lat2);
        lat += latStep
      ) {
        for (
          let lon = Math.min(lon1, lon2);
          lon < Math.max(lon1, lon2);
          lon += lonStep
        ) {
          kmlDoc
            .ele("Placemark")
            .ele("name")
            .txt(`(${lat.toFixed(5)}, ${lon.toFixed(5)})`)
            .up()
            .ele("styleUrl")
            .txt("#1")
            .up()
            .ele("Polygon")
            .ele("outerBoundaryIs")
            .ele("LinearRing")
            .ele("coordinates")
            .txt(`${lon},${lat},0 `)
            .txt(`${lon + lonStep},${lat},0 `)
            .txt(`${lon + lonStep},${lat + latStep},0 `)
            .txt(`${lon},${lat + latStep},0 `)
            .txt(`${lon},${lat},0`)
            .up()
            .up()
            .up()
            .up()
            .up();
        }
      }

      const kml = kmlDoc.end({ prettyPrint: true });

      // Create a Blob with the KML data
      const blob = new Blob([kml], {
        type: "application/vnd.google-earth.kml+xml",
      });
      const url = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = this.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the object URL
      URL.revokeObjectURL(url);
    },
    readyMap() {
      var map = this.$refs.map.leafletObject;
      map.setView([48.86, 2.34], 11);
      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      L.control.scale({imperial:false}).addTo(map);

      this.areaSelect = L.areaSelect({
        width: 250,
        height: 210,
      });
      const vm = this; // Store reference to Vue instance
      this.areaSelect.on("change", function () {
        console.log(map);
        var bounds = this.getBounds();
        // update the coordinates in the form
        vm.lat1 = bounds.getNorthEast().lat.toFixed(5);
        vm.lon1 = bounds.getNorthEast().lng.toFixed(5);
        vm.lat2 = bounds.getSouthWest().lat.toFixed(5);
        vm.lon2 = bounds.getSouthWest().lng.toFixed(5);
      });
      this.areaSelect.addTo(map);
    },
    jumpToCoordinate(){
      if (!this.mapCenter) {
        return;
      }
      const [lat, lon] = this.mapCenter.split(",").map(Number);
      this.$refs.map.leafletObject.setView([lat, lon], 11);
    }
  },
};
</script>
