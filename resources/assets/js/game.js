//import Map    from "./Map";
import Phaser from "phaser-ce";


window.onload = function() {

    let game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload () {

        game.load.image('logo', 'img/img.png');

    }

    function create () {

        let logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);

    }

};


/* Example */

/*
(async () => {

    await Map.save({
        name: 'test1',

        width: 5,
        height: 5,

        data: [
            1, 1, 1, 1, 1,
            1, 1, 2, 1, 1,
            1, 2, 2, 2, 1,
            1, 1, 2, 1, 1,
            1, 1, 1, 1, 1,
        ]
    });
    console.log('map save ok');

    window.mapData = await Map.get('test1');
    console.log(window.mapData);

})();

*/
