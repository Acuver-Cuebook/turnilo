"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let check;
class ExternalView {
    constructor(parameters) {
        const { title, linkGenerator } = parameters;
        if (!title)
            throw new Error("External view must have title");
        if (typeof linkGenerator !== "string")
            throw new Error("Must provide link generator function");
        this.title = title;
        this.linkGenerator = linkGenerator;
        let linkGeneratorFnRaw = null;
        try {
            linkGeneratorFnRaw = new Function("dataCube", "dataSource", "timezone", "filter", "splits", linkGenerator);
        }
        catch (e) {
            throw new Error(`Error constructing link generator function: ${e.message}`);
        }
        this.linkGeneratorFn = (dataCube, timezone, filter, splits) => {
            try {
                return linkGeneratorFnRaw(dataCube, dataCube, timezone, filter, splits);
            }
            catch (e) {
                throw new Error(`Error with custom link generating function '${title}': ${e.message} [${linkGenerator}]`);
            }
        };
        this.sameWindow = Boolean(parameters.sameWindow);
    }
    static isExternalView(candidate) {
        return candidate instanceof ExternalView;
    }
    static fromJS(parameters) {
        const value = parameters;
        return new ExternalView({
            title: value.title,
            linkGenerator: value.linkGenerator,
            linkGeneratorFn: value.linkGeneratorFn,
            sameWindow: value.sameWindow
        });
    }
    toJS() {
        const js = {
            title: this.title,
            linkGenerator: this.linkGenerator
        };
        if (this.sameWindow === true)
            js.sameWindow = true;
        return js;
    }
    valueOf() {
        const value = {
            title: this.title,
            linkGenerator: this.linkGenerator
        };
        if (this.sameWindow === true)
            value.sameWindow = true;
        return value;
    }
    toJSON() {
        return this.toJS();
    }
    equals(other) {
        return ExternalView.isExternalView(other) &&
            this.title === other.title &&
            this.linkGenerator === other.linkGenerator &&
            this.sameWindow === other.sameWindow;
    }
    toString() {
        return `${this.title}: ${this.linkGenerator}`;
    }
}
exports.ExternalView = ExternalView;
check = ExternalView;
//# sourceMappingURL=external-view.js.map