import { Howl, Howler } from "howler";
import soundFile from "../../sounds/Menu.mp3";
import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { Menu } from "./Menu";

export class MenuScene extends Scene {
  create() {
    let sound;

    this.createMenu();

    this.menu.on("backgroundButtonClicked", () => {
      if (App.musicAllowed) {
        sound = new Howl({
          src: [soundFile],
        });
        sound.play();
      } else {
        if (sound) {
          sound.stop();
        }
      }
    });
  }

  createMenu() {
    this.menu = new Menu();
    this.container.addChild(this.menu.container);
  }
}
