"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
exports.mergeObjects = (one, two) => {
    return R.mergeDeepWith((a, b) => b !== undefined ? b : a, one, two);
};
