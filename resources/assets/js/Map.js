import axios  from "axios";
import config from "./config";


export default class Map {
    constructor(weight, height) {
        this.weight = weight;
        this.height = height;
    }

    static async get() {
        let response = await axios.post(config.uris.map.get);

        if (response.status != 200) {
            throw new Error('Map request error!');
        }

        return response.data;
    }
};
