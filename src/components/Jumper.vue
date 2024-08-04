<template>
    <v-card class="mx-auto mb-2" max-width="600" max-height="350">
        <!-- Add a small input field with arrow icon for lat long-->
        <v-text-field
            hide-details="true"
            label="Jump to coordinate (lat, lon)"
            placeholder="48.86, 2.34"
            v-model="localPoint"
            :append-inner-icon="'mdi-target'"
            type="text"
            density="compact"
            @click:append-inner="updatePoint()"
            @keydown.enter="updatePoint()"
        ></v-text-field>
    </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useJumpStore } from '@/stores/jumpStore';
const jumpStore = useJumpStore();

const localPoint = ref('');

// Use computed to get and set the store value
const storePoint = computed(() => jumpStore.point);
localPoint.value = storePoint.value;

watch(storePoint, (newPoint) => {
    localPoint.value = newPoint;
});

const updatePoint = () => {
    // validate input
    // TODO: convert different coordinate syntax forms
    // For now just split the input at the comma and perform
    // a very basic check if the input is an integer/float
    if (!localPoint.value.includes(',')) {
        return; // do nothing
    }
    // split and quick check
    const [lat, lng] = localPoint.value.split(',').map((s) => s.trim());
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
        return; // do nothing
    }
    // we have a valid input, update the store
    const newPoint = `${parsedLat},${parsedLng}`;
    jumpStore.setPoint(newPoint);
};

// 52.518611, 13.408333
</script>
