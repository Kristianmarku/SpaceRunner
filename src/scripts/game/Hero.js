import { Howl, Howler } from "howler";
import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import jumpSoundEffect from "../../sounds/jump.mp3";
import collectDiamondSoundEffect from "../../sounds/point_collect.mp3";
import { App } from "../system/App";

export class Hero {
  constructor() {
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
    // Textures for flying animation
    this.flyTextures = [App.res("fly1"), App.res("fly2"), App.res("fly3")];
    // Texture Effect for collecting
    this.collectEffect = [
      App.res("Cosmic_21"),
      App.res("Cosmic_22"),
      App.res("Cosmic_23"),
      App.res("Cosmic_24"),
      App.res("Cosmic_25"),
    ];

    // Flying state
    this.isFlying = false;
    this.flySoundEffect = null;

    // Event listeners for keyboard input
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    // Flags to track key states
    this.isMovingLeft = false;
    this.isMovingRight = false;
  }

  handleKeyDown(event) {
    if (event.key === "a" || event.key === "A") {
      this.moveLeft();
    } else if (event.key === "d" || event.key === "D") {
      this.moveRight();
    }
  }

  handleKeyUp(event) {
    if (event.key === "a" || event.key === "A") {
      this.stopMovingLeft();
    } else if (event.key === "d" || event.key === "D") {
      this.stopMovingRight();
    }
  }

  moveLeft() {
    const forceMagnitude = -0.2; // Adjust this value based on the desired movement speed
    Matter.Body.applyForce(this.body, this.body.position, {
      x: forceMagnitude,
      y: 0,
    });
  }

  moveRight() {
    const forceMagnitude = 0.2; // Adjust this value based on the desired movement speed
    Matter.Body.applyForce(this.body, this.body.position, {
      x: forceMagnitude,
      y: 0,
    });
  }

  stopMovingLeft() {
    this.isMovingLeft = false;
  }

  stopMovingRight() {
    this.isMovingRight = false;
  }

  collectDiamond(diamond) {
    App.score++;
    Matter.World.remove(App.physics.world, diamond.body);
    if (diamond.sprite) {
      diamond.sprite.destroy();
      diamond.sprite = null;
    }

    // Play sound effect
    let sound = new Howl({
      src: [collectDiamondSoundEffect],
    });
    sound.play();

    // Emit Score
    this.sprite.emit("score");

    // Create collect effect animation
    const collectEffectAnimation = new PIXI.AnimatedSprite(this.collectEffect);
    collectEffectAnimation.anchor.set(0.5);
    collectEffectAnimation.position.set(
      this.sprite.x + this.sprite.width / 2,
      this.sprite.y + this.sprite.height / 2
    );
    collectEffectAnimation.animationSpeed = 0.2;
    collectEffectAnimation.loop = false;
    App.app.stage.addChild(collectEffectAnimation);
    collectEffectAnimation.play();

    // Update collect effect position in game loop until animation is finished
    const updateCollectEffectPosition = () => {
      collectEffectAnimation.position.set(
        this.sprite.x + this.sprite.width / 2,
        this.sprite.y + this.sprite.height / 2
      );
      if (!collectEffectAnimation.playing) {
        App.app.ticker.remove(updateCollectEffectPosition);
        collectEffectAnimation.destroy();
      }
    };
    App.app.ticker.add(updateCollectEffectPosition);

    // Ensure hero sprite is rendered above collect effect animation
    App.app.stage.addChild(this.sprite);
  }

  collectWing(wing) {
    Matter.World.remove(App.physics.world, wing.body);
    if (wing.sprite) {
      wing.sprite.destroy();
      wing.sprite = null;
    }
    this.startFlying();
  }

  startFlying() {
    this.isFlying = true;

    // Calculate the jump force to make the hero jump a little bit
    const jumpForce = -35; // Adjust this value to control the jump height

    // Apply the jump force
    Matter.Body.setVelocity(this.body, { x: 0, y: jumpForce });

    // Set the hovering force
    this.hoverForce = 0.05;

    // Disable gravity
    App.physics.gravity.y = 0;

    // Set timeout for flying
    setTimeout(() => {
      this.stopFlying();
    }, 5000);

    // Sound Effect
    this.flySoundEffect = new Howl({
      src: [jumpSoundEffect],
      rate: 2.3,
      loop: true,
    });
    this.flySoundEffect.play();

    // Switch to flying animation
    this.sprite.textures = this.flyTextures;
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
  }

  stopFlying() {
    App.physics.gravity.y = 1;
    this.isFlying = false;

    if (this.flySoundEffect) {
      this.flySoundEffect.stop();
    }
  }

  startJump() {
    if (!this.isFlying) {
      if (this.platform || this.jumpIndex === 1) {
        ++this.jumpIndex;
        this.platform = null;
        Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });

        // Sound Effect
        let sound = new Howl({
          src: [jumpSoundEffect],
        });
        sound.play();

        // Change texture to jump texture
        this.sprite.textures = [this.jumpTexture];
      }
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

    // Check if hero is out of horizontal bounds
    if (
      this.sprite.x < 0 || // Left bound
      this.sprite.x + this.sprite.width > window.innerWidth // Right bound
    ) {
      this.sprite.emit("die"); // Emit die event if hero is out of bounds
    }

    // Check if hero is out of vertical bounds (fallen)
    if (this.sprite.y > window.innerHeight) {
      this.sprite.emit("die");
    }

    // Flying
    if (this.isFlying && this.body.velocity.y < 0) {
      // Apply hovering force to counteract gravity
      Matter.Body.applyForce(this.body, this.body.position, {
        x: 0,
        y: this.hoverForce,
      });
    }

    // Apply movement based on keyboard input
    if (this.isMovingLeft) {
      this.moveLeft();
    }
    if (this.isMovingRight) {
      this.moveRight();
    }
  }

  destroy() {
    App.app.ticker.remove(this.update, this);
    Matter.World.add(App.physics.world, this.body);
    this.sprite.destroy();
  }
}
