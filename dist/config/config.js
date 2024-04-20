"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwtSecret: process.env.JWT_SECRET || 'tokensecreto',
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb+srv://rodolfo:musubi88@cluster0.fvapyht.mongodb.net/?retryWrites=true&w=majority',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }
};
