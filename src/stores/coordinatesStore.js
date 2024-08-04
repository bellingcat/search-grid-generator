import { defineStore } from 'pinia';

export const useCoordinatesStore = defineStore('coordinates', {
    // state: a function returning an initial state
    state: () => ({
        coordinates1: '',
        coordinates2: '',
    }),

    // actions: methods that can change state and contain business logic
    actions: {
        updateCoordinates(c1, c2) {
            this.coordinates1 = c1;
            this.coordinates2 = c2;
        },
    },
});
