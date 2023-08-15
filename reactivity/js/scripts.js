import { createSignal, createEffect } from './createSignal.mjs';

const [count, setCount] = createSignal(3);
createEffect(function log() { console.log(`count is ${count()}`); });
setCount(5);
setCount(count() + 2);