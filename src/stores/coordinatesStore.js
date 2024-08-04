import { defineStore } from 'pinia';

export const useCoordinatesStore = defineStore('coordinates', {
    // state: a function returning an initial state
    state: () => ({
        coordinates: {
            c1: '',
            c2: '',
        },
    }),

    // actions: methods that can change state and contain business logic
    actions: {
        updateCoordinates(newCoordinates) {
            this.coordinates = { ...this.coordinates, ...newCoordinates };
        },
        clearCoordinates() {
            this.coordinates = { ...this.coordinates, ...{ c1: '', c2: '' } };
        },
    },
});
