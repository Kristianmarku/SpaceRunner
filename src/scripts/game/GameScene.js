const Matter = require("matter-js");
const { App } = require("../system/App");
const { Scene } = require("../system/Scene");
const { Background } = require("./Background");
const { Hero } = require("./Hero");
const { LabelScore } = require("./LabelScore");
const { Platforms } = require("./Platforms");

class GameScene extends Scene {
  create() {
    this.createBackground();
    this.createPlatforms();
    this.createHero();
    this.setEvents();
    this.createUI();
    this.lastTime = performance.now();
    this.updateLoop();
  }

  createUI() {
    this.labelScore = new LabelScore();
    this.labelScore.position.set(App.app.renderer.width / 2, 10);
    this.container.addChild(this.labelScore);
    this.hero.sprite.on("score", () => {
      this.labelScore.renderScore(App.score);
    });
  }

  setEvents() {
    Matter.Events.on(
      App.physics,
      "collisionStart",
      this.onCollisionStart.bind(this)
    );
  }

  onCollisionStart(event) {
    const { pairs } = event;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyA.gameHero && bodyB.gamePlatform) {
        this.hero.stayOnPlatform(bodyB.gamePlatform);
      } else if (bodyA.gamePlatform && bodyB.gameHero) {
        this.hero.stayOnPlatform(bodyA.gamePlatform);
      } else if (bodyA.gameHero && bodyB.gameDiamond) {
        this.hero.collectDiamond(bodyB.gameDiamond);
      } else if (bodyA.gameDiamond && bodyB.gameHero) {
        this.hero.collectDiamond(bodyA.gameDiamond);
      } else if (bodyA.gameHero && bodyB.gameWing) {
        this.hero.collectWing(bodyB.gameWing);
      } else if (bodyA.gameWing && bodyB.gameHero) {
        this.hero.collectWing(bodyA.gameWing);
      }
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

    // Add event listener for pointer down event
    this.container.on("pointerdown", jumpHandler);

    // Add event listener for space button down event
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
    const diff = App.config.difficulty;
    let level = Math.floor(App.score / 5);

    if (diff === "hard") {
      level = Math.floor(App.score);
    } else if (diff === "medium") {
      level = Math.floor(App.score / 3);
    }

    const speedIncrease = level * 0.1;
    const newSpeed = App.config.platforms.moveSpeed - speedIncrease;
    const newBgSpeed = App.config.bgSpeed + level * 0.1;

    this.platforms.platforms.forEach((platform) => {
      platform.dx = newSpeed;
    });

    App.config.bgSpeed = newBgSpeed;
  }

  destroy() {
    Matter.Events.off(
      App.physics,
      "collisionStart",
      this.onCollisionStart.bind(this)
    );
    this.bg.destroy();
    this.hero.destroy();
    this.platforms.destroy();
    this.labelScore.destroy();
  }

  updateLoop() {
    const currentTime = performance.now();
    const dt = (currentTime - this.lastTime) / 1000;
    this.update(dt);
    this.lastTime = currentTime;
    requestAnimationFrame(this.updateLoop.bind(this));
  }
}

module.exports = { GameScene };
