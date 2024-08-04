<template>
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
                <GridSizeSlider />
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import GridSizeSlider from './GridSizeSlider.vue';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
const coordinatesStore = useCoordinatesStore();
</script>
