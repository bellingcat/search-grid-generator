<template>
    <v-slider
        v-model="sliderValue"
        :min="sliderMin"
        :max="sliderMax"
        :ticks="tickValues"
        :tick-labels="tickLabels"
        label="Grid Size (in km)"
        show-ticks="always"
        step="1"
        :disabled="isSliderDisabled"
        thumb-label
    ></v-slider>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useGridSizeStore } from '@/stores/gridSizeStore';
import { useMapStore } from '@/stores/mapStore';

const gridSizeStore = useGridSizeStore();
const mapStore = useMapStore();

const isSliderDisabled = computed(() => {
    // Perform the calculation based on the store's value
    return !mapStore.isPoly;
});

// watch(
//     () => gridSizeStore.gridValue,
//     (newValue, oldValue) => {
//         console.log(`Slider value changed from ${oldValue} to ${newValue}`);
//     },
// );

const sliderValue = computed({
    get: () => gridSizeStore.gridValue,
    set: (value) => gridSizeStore.setGridValue(value),
});
const sliderMin = computed(() => gridSizeStore.gridMin);
const sliderMax = computed(() => gridSizeStore.gridMax);
const tickValues = computed(() => [sliderMin.value, sliderMax.value]);
const tickLabels = computed(() => [`${sliderMin.value}`, `${sliderMax.value}`]);
</script>
