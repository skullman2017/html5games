var Ganhou = {};

Ganhou = function (game) {
	this.game = game;
};

Ganhou.prototype = {
	preload:function() {
		//preload da tela de Ganhou
		game.load.image('tela_ganhou', 'assets/telas/5. ganhou.png');
	},

	create:function() {
		setTimeout(function(){
			var fundo = game.add.sprite(0, 0, 'tela_ganhou');
			game.state.start('menu', Menu);
		}, 5000);
		
		game.input.onDown.add(function() {
			var fadeout = game.add.tween(fundo).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
			fadeout.onComplete.add(function() {
				//chamada do Menu
				game.state.start('menu', Menu);
			});
		});
	}
};