"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../general/general");
class ImmutableUtils {
    static setProperty(instance, path, newValue) {
        const bits = path.split(".");
        let lastObject = newValue;
        let currentObject;
        const getLastObject = () => {
            let o = instance;
            for (const bit of bits) {
                o = o[bit];
            }
            return o;
        };
        while (bits.length) {
            const bit = bits.pop();
            currentObject = getLastObject();
            if (currentObject.change instanceof Function) {
                lastObject = currentObject.change(bit, lastObject);
            }
            else {
                const message = "Can't find \`change()\` method on " + currentObject.constructor.name;
                console.error(message);
                throw new Error(message);
            }
        }
        return lastObject;
    }
    static getProperty(instance, path) {
        let value = instance;
        const bits = path.split(".");
        let bit;
        while (bit = bits.shift())
            value = value[bit];
        return value;
    }
    static change(instance, propertyName, newValue) {
        const v = instance.valueOf();
        if (!v.hasOwnProperty(propertyName)) {
            throw new Error(`Unknown property : ${propertyName}`);
        }
        v[propertyName] = newValue;
        return new instance.constructor(v);
    }
    static addInArray(instance, propertyName, newItem, index = -1) {
        const newArray = instance[propertyName];
        if (index === -1) {
            newArray.push(newItem);
        }
        else {
            newArray[index] = newItem;
        }
        return ImmutableUtils.change(instance, propertyName, newArray);
    }
}
exports.ImmutableUtils = ImmutableUtils;
function isEqualable(o) {
    return general_1.isObject(o) && typeof o.equals === "function";
}
exports.isEqualable = isEqualable;
function safeEquals(a, b) {
    if (isEqualable(a))
        return a.equals(b);
    return a === b;
}
exports.safeEquals = safeEquals;
//# sourceMappingURL=immutable-utils.js.map