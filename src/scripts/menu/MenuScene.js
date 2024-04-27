import { Scene } from "../system/Scene";
import { Menu } from "./Menu";

export class MenuScene extends Scene {
  create() {
    this.createMenu();
  }

  createMenu() {
    this.menu = new Menu();
    this.container.addChild(this.menu.container);
  }
}
