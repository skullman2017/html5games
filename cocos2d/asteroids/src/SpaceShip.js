var SpaceShip = cc.Sprite.extend({
	spriteFrameCache: cc.SpriteFrameCache.getInstance(),
	animeCache: cc.AnimationCache.getInstance(),
	
	angularVelocity: 3,
	velocityX: 5,
	velocityY: 5,
	
	angle: 0,
	_bullet:null,

	
	ctor:function(){
		this._super();
		
		//Carrega o sprite da nave
		this.initWithSpriteFrameName("ship_14-24.png");
		//Posiciona a nave no centro da tela
		this.setPosition(new cc.Point(screen.width/2, screen.height/2));
        
		this.scheduleUpdate();
        this.createAnimation();
        layer.addChild(this);
    },

    update:function(){
    	for(i=0; i<asteroids.length; i++)
    		this.collide(asteroids[i]);
		this.collide(ufo);
    	
    	//Rotaciona a nave
    	if (Math.abs(this.angle) >= 360)
    		this.angle = 0;
    	
    	//Se a tecla pressionada for "right", gira pra direita
    	if (LG.KEYS[cc.KEY.right] || LG.KEYS[cc.KEY.d]) {
    		this.angle += this.angularVelocity;
    		this.setRotation(this.angle);
    	}
    	//Se a tecla pressionada for "left", gira pra esquerda
    	if (LG.KEYS[cc.KEY.left] || LG.KEYS[cc.KEY.a]){
    		this.angle -= this.angularVelocity;
    		this.setRotation(this.angle);
    	}
    	
    	//Move a nave para frente (de acordo com o sentido que ela se encontra)
    	if (LG.KEYS[cc.KEY.up] || LG.KEYS[cc.KEY.w]){
        	this.xSpeed = this.velocityX*Math.sin(Math.PI/180*this.angle);
        	this.ySpeed = this.velocityY*Math.cos(Math.PI/180*this.angle);
        	//Coloca a nave na posi��o calculada
        	this.setPosition(new cc.Point(this.getPosition().x + this.xSpeed,this.getPosition().y + this.ySpeed));
			
			//Verifica sa�da/entrada na tela
        	if(this.getPosition().x >= screen.width)
				this.setPosition(new cc.Point(this.getPosition().x - screen.width, this.getPosition().y));
			if(this.getPosition().x <= 0)
				this.setPosition(new cc.Point(this.getPosition().x + screen.width, this.getPosition().y));
			if(this.getPosition().y >= screen.height)
				this.setPosition(new cc.Point(this.getPosition().x, this.getPosition().y - screen.height));
			if(this.getPosition().y <= 0)
				this.setPosition(new cc.Point(this.getPosition().x, this.getPosition().y + screen.height));
    	}
    	
    	//Faz a anima��o da nave com fogo
    	if (!LG.KEYS[cc.KEY.up]){
    		var animation = this.animeCache.getAnimation("shipFire");
			animation.setRestoreOriginalFrame(true);
			this.runAction(cc.RepeatForever.create(cc.Animate.create(animation)));
    	}
    	
    	//Teletransporta a nave
		if(LG.KEYS[cc.KEY.down] || LG.KEYS[cc.KEY.s]){
			this.setPosition(new cc.Point(Math.random()*800, Math.random()*480));
		}
		
		if(LG.KEYS[cc.KEY.space] || LG.KEYS[cc.KEY.b]){
			this.shoot();
		}
    },

	animation: function(){
		var animation = this.animeCache.getAnimation("shipFire");
		animation.setRestoreOriginalFrame(true);
		this.runAction(cc.RepeatForever.create(cc.Animate.create(animation)));	
	},

	createAnimation: function(){
    	var animeFrames = [];
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("ship_14-24.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("shipFire1_14-24.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("shipFire2_14-24.png"));
		
		var animation = cc.Animation.create(animeFrames, 0.1);
		this.animeCache.addAnimation(animation, "shipFire");
	},
	
	createExplosion: function(){
    	var animeFrames = [];
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("Explosion1_39-41.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("Explosion2_66-68.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("Explosion3_91-87.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("Explosion4_76-87.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("Explosion5_52-57.png"));
		animeFrames.push(this.spriteFrameCache.getSpriteFrame("Explosion6_25-30.png"));
		
		var animation = cc.Animation.create(animeFrames, 0.1);
		this.animeCache.addAnimation(animation, "explosion");
		animation = this.animeCache.getAnimation("explosion");
		animation.setRestoreOriginalFrame(true);
		this.runAction(cc.Animate.create(animation));
	},
	
	animationExplosion: function(){
		var animation = this.animeCache.getAnimation("explosion");
		animation.setRestoreOriginalFrame(true);
		this.runAction(cc.Animate.create(animation));	
	}
	
	
	shoot:function(dt) {
        //this.shootEffect();
        //var offset = 13;
		cc.log("shoot");
        var p = this.getPosition();
        var cs = this.getContentSize();
		var bullet = new Bullet();
		this.getParent().addChild(bullet);
		bullet.setPosition(p.x,p.y);
		
	},
	
	//Calcula o ret�ngulo que envolve o sprite da nave para verificar a colis�o
	collideRect:function(position){
		var size = this.getContentSize();
	    return cc.rect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
	},
    //Verifica se h� colis�o
    collide:function(object){
        var object1Rect = this.collideRect(this.getPosition());
        var object2Rect = object.collideRect(object.getPosition());
        
        if(cc.rectIntersectsRect(object1Rect, object2Rect))
        	this.die();
    },
	
    //Explode a nave
	die:function(){
    	layer.removeChild(this);
    	//ADICIONAR A ANIMA��O DA EXPLOS�O DA NAVE AQUI
    	this.stopAllActions();
    	//N�o testei...
    	//this.createExplosion();
    	
    	ship = new SpaceShip();
	}
});