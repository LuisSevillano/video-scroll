/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint func-names: ["error", "never"] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
require("../css/main.css").default;
// import WorldAnimatedMap from "./modules/WorldAnimatedMap";
// module.exports = WorldAnimatedMap;
const VideoScroll = require("./modules/VideoScroll_jq").default;
module.exports = VideoScroll;
