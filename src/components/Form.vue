<template>
    <v-card class="mx-auto" max-width="600">
        <v-card-text>
            <v-form v-model="isFormValid">
                <v-row class="px-3 pb-5 pt-1">
                    <v-text-field
                        class="pr-1"
                        v-model="tempCoordinates.c1"
                        label="Coordinate 1 (lat, lon)"
                        placeholder="48.90529373066811, 2.2584719879516464"
                        outlined
                        density="compact"
                        hide-details="true"
                        @input="validateCoordinate('c1', tempCoordinates.c1)"
                    ></v-text-field>
                    <v-text-field
                        class="pl-1"
                        v-model="tempCoordinates.c2"
                        label="Coordinate 2 (lat, lon)"
                        placeholder="48.81418021233939, 2.4172392962309246"
                        outlined
                        density="compact"
                        hide-details="true"
                        @input="validateCoordinate('c2', tempCoordinates.c2)"
                    ></v-text-field>
                </v-row>
                <GridSizeSlider />
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { reactive, watch } from 'vue';
import GridSizeSlider from './GridSizeSlider.vue';
import { cleanCoordinate } from '@/lib/misc';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
const coordinatesStore = useCoordinatesStore();

const tempCoordinates = reactive({ ...coordinatesStore.coordinates });

// Watch store changes and update local data
watch(
    () => coordinatesStore.coordinates,
    (newValue) => {
        // Update when the store data changes
        // console.log('new data', newValue);

        tempCoordinates.c1 = newValue.c1;
        tempCoordinates.c2 = newValue.c2;
    },
    { deep: true },
);

// Validation rules
const validateCoordinate = (key, value) => {
    const { coordinate, error } = cleanCoordinate(value);
    // if no error was found, update the store with the clean coordinate
    if (!error) {
        switch (key) {
            case 'c1':
                if (coordinatesStore.coordinates.c1 !== coordinate) {
                    coordinatesStore.updateCoordinates({ c1: coordinate });
                }
                break;
            case 'c2':
                if (coordinatesStore.coordinates.c2 !== coordinate) {
                    coordinatesStore.updateCoordinates({ c2: coordinate });
                }
                break;
            default:
                break;
        }
    } else {
        // console.log('validation error, no update');
    }
};
</script>
