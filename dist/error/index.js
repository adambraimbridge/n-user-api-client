"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorWithData extends Error {
    constructor(message, data = {}) {
        super(message);
        this.data = data;
        this.name = this.constructor.name;
    }
}
exports.ErrorWithData = ErrorWithData;
