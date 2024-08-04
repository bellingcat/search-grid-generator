<template>
    <v-card class="mx-auto" max-width="600">
        <v-card-actions>
            <v-btn
                variant="elevated"
                color="primary"
                @click="downloadKML"
                :disabled="isButtonDisabled"
                >Download Search Grid</v-btn
            >
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import { createKML } from '@/lib/maputils';
const mapStore = useMapStore();

// initial check if we have a grid to download
const isButtonDisabled = computed(() => {
    return mapStore.grid === null;
});

const downloadKML = () => {
    // getthe current grid from the mapstore
    const { grid } = mapStore;
    // create the kml from it
    const kml = createKML(grid);

    // Create a Blob with the KML data
    const blob = new Blob([kml], {
        type: 'application/vnd.google-earth.kml+xml',
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grid.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL
    URL.revokeObjectURL(url);
};
</script>
