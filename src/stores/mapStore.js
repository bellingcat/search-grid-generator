import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
    // state: a function returning an initial state
    state: () => ({
        grid: null,
        isPoly: false,
    }),

    // actions: methods that can change state and contain business logic
    actions: {
        updateGrid(newGrid) {
            this.grid = newGrid;
        },
        updateIsPoly(isPoly) {
            this.isPoly = isPoly;
        },
    },
});
