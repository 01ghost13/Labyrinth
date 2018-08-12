//import axios  from "axios";
import config from "./config";


export default class Map {
    constructor(weight, height) {
        this.weight = weight;
        this.height = height;
    }

    static async get(name) {

        let response = await axios.post(config.uris.map.get, { name: name });

        if (response.status != 200) {
            throw new Error('Map request error!');
        }

        return response.data;

    }

    static async save(data) {

        let response = await axios.post(config.uris.map.set, data);

        if (response.status != 200 || response.data.error) {
            throw new Error('Map save error! Error: ' + response.data.error);
        }

    }
};
