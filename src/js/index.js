/* eslint no-console: ["error", { allow: ["log"] }] */

/* eslint func-names: ["error", "never"] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
import css from "../css/main.css";
import VideoScroll from "./modules/VideoScroll";

new VideoScroll({
  // stepSelector: ".scroll-step"
}).init();
