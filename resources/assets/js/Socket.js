class Socket {
    constructor() {
        this.conn = new WebSocket('ws://' + window.location.hostname + ':8090');
    }
}