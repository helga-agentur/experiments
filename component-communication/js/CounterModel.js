import EventEmitter from './EventEmitter.js';

export default class extends EventEmitter {

    counter = 0;

    add() {
        this.counter++;
        this.emit('update', this.counter);
    }

}
