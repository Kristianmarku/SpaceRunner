import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Matter from "matter-js";
import * as PIXI from "pixi.js";
import { Loader } from "./Loader";
import { ScenesManager } from "./ScenesManager";

class Application {
  constructor() {
    this.score = 0;
    this.musicAllowed = false;
  }

  run(config) {
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);

    this.config = config;

    this.app = new PIXI.Application({ resizeTo: window });
    document.body.appendChild(this.app.view);

    this.scenes = new ScenesManager();
    this.app.stage.interactive = true;
    this.app.stage.addChild(this.scenes.container);

    this.loader = new Loader(this.app.loader, this.config);
    this.loader.preload().then(() => this.start());

    this.createPhysics();
  }

  createPhysics() {
    this.physics = Matter.Engine.create();
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.physics);
  }

  res(key) {
    return this.loader.resources[key].texture;
  }

  sprite(key) {
    return new PIXI.Sprite(this.res(key));
  }

  start() {
    this.scenes.start("MenuScene");
  }
}

export const App = new Application();
