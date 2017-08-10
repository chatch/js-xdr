"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.calculatePadding = calculatePadding;
function calculatePadding(length) {
    switch (length % 4) {
        case 0:
            return 0;
        case 1:
            return 3;
        case 2:
            return 2;
        case 3:
            return 1;
    }
}