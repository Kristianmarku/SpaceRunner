import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Hero {
  constructor() {
    this.score = 0;
    this.createSprite();
    this.createBody();
    App.app.ticker.add(this.update, this);

    // jump speed
    this.dy = App.config.hero.jumpSpeed;
    this.maxJumps = App.config.hero.maxJumps;
    this.jumpIndex = 0;

    // Texture for jumping
    this.jumpTexture = App.res("jump");
    // Textures for walking animation
    this.walkTextures = [App.res("walk1"), App.res("walk2")];
  }

  collectDiamond(diamond) {
    ++this.score;
    Matter.World.remove(App.physics.world, diamond.body);
    if (diamond.sprite) {
      diamond.sprite.destroy();
      diamond.sprite = null;
    }
    this.sprite.emit("score");
  }

  startJump() {
    if (this.platform || this.jumpIndex === 1) {
      ++this.jumpIndex;
      this.platform = null;
      Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
      // Change texture to jump texture
      this.sprite.textures = [this.jumpTexture];
    }
  }

  // if player touches the ground, reset jumpIndex.
  stayOnPlatform(platform) {
    this.platform = platform;
    this.jumpIndex = 0;
    // Change texture to walk animation
    this.sprite.textures = this.walkTextures;
    this.sprite.play(); // Resume the walking animation
  }

  createBody() {
    this.body = Matter.Bodies.rectangle(
      this.sprite.x + this.sprite.width / 2,
      this.sprite.y + this.sprite.height / 2,
      this.sprite.width,
      this.sprite.height,
      { friction: 0 }
    );
    Matter.World.add(App.physics.world, this.body);
    this.body.gameHero = this;
  }

  createSprite() {
    this.sprite = new PIXI.AnimatedSprite([App.res("walk1"), App.res("walk2")]);

    this.sprite.x = App.config.hero.position.x;
    this.sprite.y = App.config.hero.position.y;
    this.sprite.loop = true;
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
  }

  update() {
    this.sprite.x = this.body.position.x - this.sprite.width / 2;
    this.sprite.y = this.body.position.y - this.sprite.height / 2;

    if (this.sprite.y > window.innerHeight) {
      this.sprite.emit("die");
    }
  }

  destroy() {
    App.app.ticker.remove(this.update, this);
    Matter.World.add(App.physics.world, this.body);
    this.sprite.destroy();
  }
}
