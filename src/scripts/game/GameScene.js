import Matter from "matter-js";
import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { Background } from "./Background";
import { Hero } from "./Hero";
import { LabelScore } from "./LabelScore";
import { Platforms } from "./Platforms";

export class GameScene extends Scene {
  create() {
    this.createBackground();
    this.createPlatforms();
    this.createHero();
    this.setEvents();
    this.createUI();
  }

  createUI() {
    this.labelScore = new LabelScore();
    this.labelScore.position.set(App.app.renderer.width / 2, 10);
    this.container.addChild(this.labelScore);
    this.hero.sprite.on("score", () => {
      this.labelScore.renderScore(App.score);
    });
  }

  // If matters touch fire collisionStart
  setEvents() {
    Matter.Events.on(
      App.physics,
      "collisionStart",
      this.onCollisionStart.bind(this)
    );
  }

  // if player is on platform
  onCollisionStart(event) {
    const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB];
    const hero = colliders.find((body) => body.gameHero);
    const platform = colliders.find((body) => body.gamePlatform);
    const diamond = colliders.find((body) => body.gameDiamond);
    const wing = colliders.find((body) => body.gameWing);

    if (hero && platform) {
      this.hero.stayOnPlatform(platform.gamePlatform);
    }

    if (hero && diamond) {
      this.hero.collectDiamond(diamond.gameDiamond);
    }

    if (hero && wing) {
      this.hero.collectWing(wing.gameWing);
    }
  }

  createPlatforms() {
    this.platforms = new Platforms();
    this.container.addChild(this.platforms.container);
  }

  createHero() {
    this.hero = new Hero();
    this.container.addChild(this.hero.sprite);
    this.container.interactive = true;

    const jumpHandler = () => {
      this.hero.startJump();
      this.hero.stopFlying();
    };

    // Handle pointer down event
    this.container.on("pointerdown", jumpHandler);

    // Handle space button down event
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        jumpHandler();
      }
    });

    this.hero.sprite.once("die", () => {
      App.scenes.start("GameOverScene");
    });
  }

  createBackground() {
    this.bg = new Background();
    this.container.addChild(this.bg.container);
  }

  update(dt) {
    this.bg.update(dt);
    this.platforms.update(dt);
    this.levelDifficulty();
  }

  levelDifficulty() {
    // Get difficulty from config
    const diff = App.config.difficulty;
    console.log(diff);

    // Calculate the level based on the current score
    let level = Math.floor(App.score / 5);

    if (diff === "hard") {
      level = Math.floor(App.score / 1);
    } else if (diff === "medium") {
      level = Math.floor(App.score / 3);
    }

    // Calculate the increase in platform movement speed based on the level
    const speedIncrease = level * 0.1; // Adjust the factor as needed

    // Calculate the new platform movement speed
    const newSpeed = App.config.platforms.moveSpeed - speedIncrease;

    // Calculate the new background speed
    const newBgSpeed = App.config.bgSpeed + level * 0.1; // Adjust the factor as needed

    // Update the platform movement speed
    this.platforms.platforms.forEach((platform) => {
      platform.dx = newSpeed;
    });

    // Update the background speed
    App.config.bgSpeed = newBgSpeed;
  }

  destroy() {
    Matter.Events.off(
      App.physics,
      "collisionStart",
      this.onCollisionStart.bind(this)
    );
    App.app.ticker.remove(this.update, this);
    this.bg.destroy();
    this.hero.destroy();
    this.platforms.destroy();
    this.labelScore.destroy();
  }
}
