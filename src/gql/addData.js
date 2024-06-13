"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_request_1 = require("graphql-request");
var random_words_1 = require("random-words");
// Initialize the GraphQL client
var endpoint = "https://polished-coral-89.hasura.app/v1/graphql";
var client = new graphql_request_1.GraphQLClient(endpoint, {
    headers: {
        "x-hasura-admin-secret": "fnLCtKGI4y9uSXf0WMOJZFpcutFkXhoLp114pD5voOLjCg6XhXeT4VlPg5kVW0c9",
    },
});
// inserting articles
var INSERT_ARTICLES = (0, graphql_request_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation InsertBlog($articles: [blog_insert_input!]!) {\n    insert_blog(objects: $articles) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation InsertBlog($articles: [blog_insert_input!]!) {\n    insert_blog(objects: $articles) {\n      affected_rows\n    }\n  }\n"])));
// to generate random articles
var generateRandomArticles = function (count) {
    var articles = [];
    for (var i = 0; i < count; i++) {
        var title = (0, random_words_1.generate)({ min: 5, max: 10 });
        articles.push({
            title: title.join(" "),
            content: (0, random_words_1.generate)({ min: 50, max: 100 }).join(" "),
            author: (0, random_words_1.generate)({ min: 2, max: 2 }).join(" "),
            slug: title.join("-").toLowerCase(),
        });
    }
    return articles;
};
// Main function to insert articles
var insertArticles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var articles, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                articles = generateRandomArticles(2);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.request(INSERT_ARTICLES, { articles: articles })];
            case 2:
                data = _a.sent();
                console.log("Inserted  articles successfully!");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error inserting articles:", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
console.log(generateRandomArticles(2));
var templateObject_1;
