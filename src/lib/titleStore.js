import {writable} from "svelte/store";

function createTitle(initValue){
    const {subscribe, set, update} = writable(initValue)

    return {
        subscribe,
        set,
    };
}

export const title = createTitle('포토 로그');
