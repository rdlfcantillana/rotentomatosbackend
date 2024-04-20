"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRating = exports.fuzzySearchUsers = exports.getUserData = exports.modifyUserPassword = exports.changePicture = exports.modifyUser = exports.checkUsername = exports.deleteUser = exports.signIn = exports.newCritic = exports.signUp = exports.testerController = void 0;
const user_1 = __importDefault(require("../models/user"));
const movie_1 = __importDefault(require("../models/movie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const id_Extractor_1 = require("./id.Extractor");
const fuzzy = __importStar(require("fuzzy"));
// Expira en 1209600 Segundos o 14 dias
function createtoken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.default.jwtSecret, {
        expiresIn: 604800
    });
}
const testerController = (req, res) => {
    var _a;
    console.log("Received body: ", req.body);
    console.log("Authorization header: ", req.headers.authorization);
    const authorization = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    console.log("Extracted ID:", userId);
    return res.status(200).json({ msg: "Reached the end" });
};
exports.testerController = testerController;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password || !req.body.username || !req.body.fullname) {
        return res.status(400).json({ msg: 'Please. Provide with all the fields of a User (email, password, username and fullname)' });
    }
    const foundUsers = yield user_1.default.find({
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    });
    if (!(foundUsers.length === 0)) {
        return res.status(400).json({ msg: "The username or email are already used" });
    }
    const newUser = new user_1.default(req.body);
    yield newUser.save();
    return res.status(201).json(newUser);
});
exports.signUp = signUp;
const newCritic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password || !req.body.username || !req.body.fullname) {
        return res.status(400).json({ msg: 'Please. Provide with all the fields of a User (email, password, username and fullname)' });
    }
    const foundUsers = yield user_1.default.find({
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    });
    if (!(foundUsers.length === 0)) {
        return res.status(400).json({ msg: "The username or email are already used" });
    }
    req.body.isCritic = true;
    req.body.profilePicture = "https://africandelightstore.com/cdn/shop/files/1453_800x.jpg?v=1688339687";
    const newUser = new user_1.default(req.body);
    yield newUser.save();
    return res.status(201).json(newUser);
});
exports.newCritic = newCritic;
// GENERATE JWT FROM USER
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.password) {
        return res.status(400).json({ msg: 'Please. Send your password' });
    }
    if (req.body.email) {
        const user = yield user_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'The user does not exist' });
        }
        const isMatch = yield user.comparePassword(req.body.password);
        if (isMatch) {
            return res.status(200).json({ token: createtoken(user) });
        }
    }
    else if (req.body.username) {
        const user = yield user_1.default.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ msg: 'The user does not exist' });
        }
        const isMatch = yield user.comparePassword(req.body.password);
        if (isMatch) {
            return res.status(200).json({ token: createtoken(user) });
        }
    }
    else {
        return res.status(400).json({ msg: 'Please. Send email or username' });
    }
    return res.status(400).json({
        msg: 'The email or password are incorrect'
    });
});
exports.signIn = signIn;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authorization = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.password) {
        return res.status(400).json({ msg: "Please. Send the password" });
    }
    try {
        if (userId) {
            const user = yield user_1.default.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ msg: "User does not exist" });
            }
            const isMatch = yield user.comparePassword(req.body.password);
            if (isMatch) {
                yield user_1.default.deleteOne({ _id: userId });
                return res.status(200).json({ msg: `Deleted User with username: ${user.username}` });
            }
            else {
                return res.status(400).json({ msg: "Password did not match" });
            }
        }
        else {
            console.log("User ID is undefined");
            return res.status(400).json({ msg: "A problem arised with the UserId" });
        }
    }
    catch (error) {
        console.error('Error arised in deleteUser controller:', error);
        return res.status(500).json({ msg: `Something went wrong ${error}` });
    }
});
exports.deleteUser = deleteUser;
function isUsernameAvailable(newUsername, currentUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield user_1.default.findOne({ username: newUsername });
        return !existingUser || (existingUser.username === currentUsername);
    });
}
const checkUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.newUsername || !req.body.username) {
        return res.status(400).json({ msg: "Please. Pass the usernames to check" });
    }
    const Available = yield isUsernameAvailable(req.body.newUsername, req.body.username);
    if (Available) {
        return res.status(200).json({ isValidUsername: true, msg: "Username is Available." });
    }
    return res.status(400).json({ isValidUsername: false, msg: "Username is not Available." });
});
exports.checkUsername = checkUsername;
const modifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authorization = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.newUsername && !req.body.newFullname && !req.body.newBio) {
        return res.status(400).json({ msg: "No parameters passed. No changes to the user", missingParams: "newUsername, newFullname, newBio" });
    }
    try {
        if (userId) {
            const user = yield user_1.default.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ msg: 'The user does not exist' });
            }
            var modifiedFields = {
                username: "unchanged",
                bio: "unchanged",
                fullname: "unchanged"
            };
            var changeFail = false;
            if (req.body.newUsername) {
                const Available = yield isUsernameAvailable(req.body.newUsername, user.username);
                if (Available) {
                    yield user.modifyUsername(req.body.newUsername);
                    modifiedFields['username'] = "Changed Successfully!";
                }
                else {
                    modifiedFields['username'] = "Error! Unavailable.";
                    changeFail = true;
                }
            }
            if (req.body.newBio) {
                yield user.modifyBio(req.body.newBio);
                modifiedFields['bio'] = "Changed Successfully!";
            }
            if (req.body.newFullname) {
                yield user.modifyFullname(req.body.newFullname);
                modifiedFields['fullname'] = "Changed Successfully!";
            }
            if (changeFail) {
                return res.status(207).json({ msg: "Partial Success on the changes", modifiedFields });
            }
            return res.status(200).json({ msg: "Changes were done correctly", modifiedFields });
        }
        else {
            console.log("Used Id is undefined");
            return res.status(400).json({ msg: "A problem arised with the JWT" });
        }
    }
    catch (error) {
        console.error('Error decoding JWT:', error);
        return res.status(500).json({ msg: `Something went wrong ${error}` });
    }
});
exports.modifyUser = modifyUser;
const changePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const authorization = (_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.newProfilePicture) {
        return res.status(400).json({ msg: "Please. Provide with the profile picture link" });
    }
    if (userId) {
        const user = yield user_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ msg: 'The user does not exist' });
        }
        yield user.modifyPFP(req.body.newProfilePicture);
        return res.status(200).json({ msg: "Profile Picture modified correctly" });
    }
    else {
        return res.status(400).json({ msg: "Error parsing the JWT" });
    }
});
exports.changePicture = changePicture;
const modifyUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const authorization = (_d = req.headers) === null || _d === void 0 ? void 0 : _d.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.newPassword) {
        return res.status(400).json({ msg: "Please pass the req.body.newPassword" });
    }
    try {
        if (userId) {
            const user = yield user_1.default.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ msg: 'The user does not exist' });
            }
            const modifiedUser = yield user.modifyPassword(req.body.newPassword);
            if (modifiedUser) {
                return res.status(200).json({ msg: `User ${modifiedUser} modified successfully with New Password` });
            }
            else {
                return res.status(500).json({ msg: "Something went wrong modifying the user" });
            }
        }
        else {
            console.log("User Id is undefined");
            return res.status(400).json({ msg: "A problem arised with the JWT" });
        }
    }
    catch (error) {
        console.error('Error decoding JWT:', error);
        return res.status(500).json({ msg: `Something went wrong ${error}` });
    }
});
exports.modifyUserPassword = modifyUserPassword;
// READ THE USER DATA
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const authorization = (_e = req.headers) === null || _e === void 0 ? void 0 : _e.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.userId) {
        return res.status(400).json({ msg: "Please. Provide with the desired userId" });
    }
    try {
        if (userId) {
            const user = yield user_1.default.findOne({ _id: req.body.userId });
            if (!user) {
                return res.status(400).json({ msg: 'The user does not exist' });
            }
            return res.status(200).json({
                msg: "User data sent",
                id: `${user._id}`,
                username: `${user.username}`,
                fullname: `${user.fullname}`,
                bio: `${user.bio}`,
                PFP: `${user.profilePicture}`,
                isCritic: `${user.isCritic}`
            });
        }
        else {
            console.log("User Id is undefined");
            return res.status(400).json({ msg: "A problem arised with the JWT" });
        }
    }
    catch (error) {
        console.error('Error decoding JWT:', error);
        return res.status(500).json({ msg: `Something went wrong ${error}` });
    }
});
exports.getUserData = getUserData;
const fuzzySearchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const authorization = (_f = req.headers) === null || _f === void 0 ? void 0 : _f.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.username) {
        return res.status(400).json({ msg: "Please. Provide with the username to search" });
    }
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ msg: 'The user does not exist' });
    }
    const allUsers = yield user_1.default.find({}, 'username fullname profilePicture bio');
    const results = fuzzy.filter(req.body.username, allUsers, { extract: user => user.username });
    const matchedUsers = results.map(result => result.original);
    return res.status(200).json(matchedUsers);
});
exports.fuzzySearchUsers = fuzzySearchUsers;
// RATE MOVIE
const movieRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const authorization = (_g = req.headers) === null || _g === void 0 ? void 0 : _g.authorization;
    const userId = (0, id_Extractor_1.extractId)(authorization);
    if (!req.body.userRating) {
        req.body.userRating = 0;
    }
    if (!req.body.movieId) {
        return res.status(400).json({ msg: "Please. Provide with the movie Id (movieId)" });
    }
    if (req.body.userRating < 0 || req.body.userRating > 5) {
        return res.status(400).json({ msg: "Invalid user rating, must be between 0 and 5" });
    }
    try {
        if (userId) {
            const user = yield user_1.default.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ msg: 'The user does not exist' });
            }
            const movie = yield movie_1.default.findOne({ apiId: req.body.movieId });
            if (!movie) {
                return res.status(400).json({ msg: 'Movie not found by its apiId' });
            }
            if (user.isCritic) {
                // @ts-ignore
                movie.updateRunningMeanCritics(userId, req.body.userRating);
            }
            else {
                // @ts-ignore
                movie.updateRunningMeanUsers(userId, req.body.userRating);
            }
            return res.status(200).json({ msg: "Movie rated successfully" });
        }
        else {
            console.log("Used Id is undefined");
            return res.status(400).json({ msg: "A problem arised with the JWT" });
        }
    }
    catch (error) {
        console.error('Error decoding JWT:', error);
        return res.status(500).json({ msg: `Something went wrong ${error}` });
    }
});
exports.movieRating = movieRating;
