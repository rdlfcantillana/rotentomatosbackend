"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function extractId(authorization) {
    if (authorization) {
        const receivedJwt = authorization.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.decode(receivedJwt);
        if (decodedToken.id) {
            return decodedToken.id;
        }
        else {
            console.error('Invalid JWT');
            return undefined;
        }
    }
    else {
        console.log(" undefined");
        return undefined;
    }
}
exports.extractId = extractId;
