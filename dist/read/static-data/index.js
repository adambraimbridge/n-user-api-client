"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("n-common-static-data");
exports.demographics = {
    positions: data.demographics.positions.positions.filter(item => item.active),
    responsibilities: data.demographics.responsibilities.responsibilities.filter(item => item.active),
    industries: data.demographics.industries.industries.filter(item => item.active)
};
exports.titles = [
    { description: 'Ms', code: 'Ms' },
    { description: 'Miss', code: 'Miss' },
    { description: 'Mrs', code: 'Mrs' },
    { description: 'Mr', code: 'Mr' },
    { description: 'Dr', code: 'Dr' },
    { description: 'Prof', code: 'Prof' },
    { description: 'Sir', code: 'Sir' }
];
