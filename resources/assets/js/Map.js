import axios  from "axios";
import config from "./config";


export default class Map {
    constructor(weight, height) {
        this.weight = weight;
        this.height = height;
    }

    static async testMap() {
        return {
            'width': 10,
            'height': 10,
            'data': [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
                1, 2, 2, 2, 2, 2, 2, 1, 2, 1,
                1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
                1, 2, 2, 2, 1, 1, 2, 2, 2, 1,
                1, 2, 2, 2, 1, 1, 2, 2, 2, 1,
                1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
                1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
                1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            'players': [{id: 2, x: 110, y: 110}, {id: 3, x: 110, y: 110}]
        };
    }

    static async get() {
        let response = await axios.post(config.uris.map.get);

        if (response.status !== 200) {
            throw new Error('Map request error!');
        }

        return response.data;
    }
};
