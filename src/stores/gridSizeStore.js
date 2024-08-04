import { defineStore } from 'pinia';

export const useGridSizeStore = defineStore('gridsize', {
    // state: a function returning an initial state
    state: () => ({
        gridValue: 5,
        gridMin: 1,
        gridMax: 50,
    }),

    // getters: computed properties
    // getters: {
    //   doubleCount: (state) => state.count * 2,
    // },

    // actions: methods that can change state and contain business logic
    actions: {
        setGridValue(newGridValue) {
            this.gridValue = newGridValue;
        },
        setGridMinMax(min, max) {
            this.gridMin = min;
            this.gridMax = max;
            if (this.gridValue < min || this.gridValue > max) {
                this.gridValue = Math.ceil(min + max / 2);
            }
        },
    },
});
