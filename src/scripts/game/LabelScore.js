import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class LabelScore extends PIXI.Container {
  constructor() {
    super();
    this.createBadge();
    this.renderScore();
  }

  createBadge() {
    // Create a graphics object for the score badge
    const badgeWidth = 155; // Initial width of the badge
    const badgeHeight = 60;
    const scoreBadge = new PIXI.Graphics();
    scoreBadge.beginFill(0x000000, 0.8);
    scoreBadge.drawRoundedRect(0, 0, badgeWidth, badgeHeight, 10);
    scoreBadge.endFill();

    // Add the text for the score
    const scoreStyle = new PIXI.TextStyle({
      fontFamily: "Verdana",
      fontWeight: "bold",
      fontSize: 30,
      fill: ["#ffffff"],
    });
    this.scoreText = new PIXI.Text("Points", scoreStyle);
    this.scoreText.position.set(10, 15);

    // Add the score badge and text to the container
    this.addChild(scoreBadge, this.scoreText);

    // Store the badge width for later use
    this.badgeWidth = badgeWidth;
  }

  renderScore(score = 0) {
    this.scoreText.text = `Points ${score}`;
    // Check if the text width exceeds the badge width
    const textWidth = this.scoreText.width;
    if (textWidth > this.badgeWidth - 20) {
      // Resize the badge to accommodate the text
      this.scoreText.width = this.badgeWidth - 20; // Adjusted padding
    } else {
      // Reset badge width if text fits comfortably
      this.scoreText.width = textWidth;
    }
  }
}
