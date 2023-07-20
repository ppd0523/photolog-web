import {writable} from "svelte/store";

function createLocation(initValue){
    const {subscribe, set, update} = writable(initValue)

    return {
        subscribe,
        set,
    };
}

export const location = createLocation('');
