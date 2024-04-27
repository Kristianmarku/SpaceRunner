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

    if (hero && platform) {
      this.hero.stayOnPlatform(platform.gamePlatform);
    }

    if (hero && diamond) {
      this.hero.collectDiamond(diamond.gameDiamond);
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
