<template>
    <v-app>
      <v-container>
        <v-responsive class="align-center text-center overflow-visible">
      <v-img height="100" src="@/assets/logo.svg" />
      <h1 class="py-2 font-weight-bold">Search Grid Generator</h1>
      <!-- Title and Information -->
      <v-row justify="center" class="text-left py-2">
        <v-col cols="12" md="8" lg="6" xl="4">
          <p class="py-2">
            A tool for generating a grid of rectangular polygons in a KML file. The resulting KML file can be opened in Google Earth and used for systematically searching an area.
          </p>
          </v-col>
      </v-row>
        <v-card class="mx-auto" max-width="600">
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="latLong1"
                label="Coordinate 1 (lat, lon)"
                placeholder="48.90529373066811, 2.2584719879516464"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="latLong2"
                label="Coordinate 2 (lat, lon)"
                placeholder="48.81418021233939, 2.4172392962309246"
                outlined
              ></v-text-field>
              <v-text-field
                v-model.number="gridSize"
                label="Grid Size (km)"
                placeholder="1"
                outlined
                type="number"
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
            <v-btn color="primary" @click="generateKML">Generate KML</v-btn>
          </v-card-actions>
        </v-card>
        </v-responsive>
      </v-container>
    </v-app>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        latLong1: "48.90529373066811, 2.2584719879516464",
        latLong2: "48.81418021233939, 2.4172392962309246",
        gridSize: 1,
        fileName: "grid.kml"
      };
    },
    methods: {
      generateKML() {
        const [lat1, lon1] = this.latLong1.split(',').map(Number);
        const [lat2, lon2] = this.latLong2.split(',').map(Number);
        const gridSizeKm = this.gridSize;
  
        // Convert grid size to degrees
        const degPerKm = 1 / 111; // Approximate value for one degree of latitude in km
        const midLat = (lat1 + lat2) / 2;
        const latStep = gridSizeKm * degPerKm;
        const lonStep = gridSizeKm * degPerKm / Math.cos(midLat * Math.PI / 180);
  
        // Initialize KML
        let kml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        kml += `<kml xmlns="http://www.opengis.net/kml/2.2">\n`;
        kml += `<Document>\n`;
        kml += `<name>Grid</name>\n`;
  
        for (let lat = Math.min(lat1, lat2); lat < Math.max(lat1, lat2); lat += latStep) {
          for (let lon = Math.min(lon1, lon2); lon < Math.max(lon1, lon2); lon += lonStep) {
            kml += `<Placemark>\n`;
            kml += `<name>(${lat.toFixed(5)}, ${lon.toFixed(5)})</name>\n`;
            kml += `<Polygon>\n`;
            kml += `<outerBoundaryIs>\n`;
            kml += `<LinearRing>\n`;
            kml += `<coordinates>\n`;
            kml += `${lon},${lat},0\n`;
            kml += `${lon + lonStep},${lat},0\n`;
            kml += `${lon + lonStep},${lat + latStep},0\n`;
            kml += `${lon},${lat + latStep},0\n`;
            kml += `${lon},${lat},0\n`;
            kml += `</coordinates>\n`;
            kml += `</LinearRing>\n`;
            kml += `</outerBoundaryIs>\n`;
            kml += `</Polygon>\n`;
            kml += `</Placemark>\n`;
          }
        }
  
        kml += `</Document>\n`;
        kml += `</kml>`;
  
        // Create a Blob with the KML data
        const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
        const url = URL.createObjectURL(blob);
  
        // Create a temporary link to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileName.endsWith('.kml') ? this.fileName : `${this.fileName}.kml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        // Revoke the object URL
        URL.revokeObjectURL(url);
      }
    }
  };
  </script>
  
  <!-- <style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  label {
    display: block;
    margin: 10px 0 5px;
  }
  input {
    margin-bottom: 20px;
    padding: 5px;
    font-size: 1em;
  }
  button {
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
  }
  </style> -->
  