import { defineStore } from 'pinia';

export const useJumpStore = defineStore('jump', {
    // state: a function returning an initial state
    state: () => ({
        point: '',
    }),

    // actions: methods that can change state and contain business logic
    actions: {
        setPoint(newPoint) {
            this.point = newPoint;
        },
    },
});
