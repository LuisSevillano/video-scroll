/* eslint no-console: ["error", { allow: ["log"] }] */

/* eslint func-names: ["error", "never"] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
import css from "../css/main.css";
import VideoScroll from "./modules/VideoScroll_jq";

new VideoScroll({
  stepSelector: ".scroll-step",
  scrollOffset: -30,
  animDuration: 750,
  configFile: "config.csv",
  bulletIndicator: true
}).init();
