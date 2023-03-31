"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const handle_request_errors_1 = require("./handle-request-errors");
const request_errors_1 = require("./request-errors");
describe("handleRequestErrors", () => {
    const response = {};
    const logger = {};
    beforeEach(() => {
        response.status = sinon_1.default.stub().returns(response);
        response.send = sinon_1.default.stub().returns(response);
        logger.error = sinon_1.default.spy();
    });
    const handleError = (e) => handle_request_errors_1.handleRequestErrors(e, response, logger);
    describe("InvalidRequestError", () => {
        it("should set response status to 400", () => {
            handleError(new request_errors_1.InvalidRequestError("foobar"));
            chai_1.expect(response.status.calledWith(400)).to.be.true;
        });
        it("should send error message as response", () => {
            handleError(new request_errors_1.InvalidRequestError("foobar"));
            chai_1.expect(response.send.calledWith({ error: "foobar" })).to.be.true;
        });
    });
    describe("AccessDeniedError", () => {
        it("should set response status to 403", () => {
            handleError(new request_errors_1.AccessDeniedError("foobar"));
            chai_1.expect(response.status.calledWith(403)).to.be.true;
        });
        it("should send error message as response", () => {
            handleError(new request_errors_1.AccessDeniedError("foobar"));
            chai_1.expect(response.send.calledWith({ error: "foobar" })).to.be.true;
        });
    });
    describe("Unexpected error", () => {
        it("should set response status to 500", () => {
            handleError(new Error("foobar"));
            chai_1.expect(response.status.calledWith(500)).to.be.true;
        });
        it("should send error message in response", () => {
            handleError(new Error("foobar"));
            chai_1.expect(response.send.calledWith({ message: "foobar", error: "Unexpected error" })).to.be.true;
        });
        it("should log error with stack", () => {
            handleError(new Error("foobar"));
            chai_1.expect(logger.error.calledWithMatch("foobar\nError: foobar\n    at")).to.be.true;
        });
    });
});
//# sourceMappingURL=handle-request-errors.mocha.js.map