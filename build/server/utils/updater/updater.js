"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_class_1 = require("immutable-class");
const functional_1 = require("../../../common/utils/functional/functional");
const general_1 = require("../../../common/utils/general/general");
function getName(thing) {
    return thing.name;
}
function updater(oldThings, newThings, updatedOptions) {
    const key = updatedOptions.key || getName;
    const equals = updatedOptions.equals || immutable_class_1.immutableEqual;
    const onEnter = updatedOptions.onEnter || functional_1.noop;
    const onUpdate = updatedOptions.onUpdate || functional_1.noop;
    const onExit = updatedOptions.onExit || functional_1.noop;
    const initialByKey = {};
    for (const initialThing of oldThings) {
        const initialThingKey = key(initialThing);
        if (initialByKey[initialThingKey])
            throw new Error(`duplicate key '${initialThingKey}'`);
        initialByKey[initialThingKey] = initialThing;
    }
    for (const newThing of newThings) {
        const newThingKey = key(newThing);
        const oldThing = initialByKey[newThingKey];
        if (oldThing) {
            if (!equals(newThing, oldThing)) {
                onUpdate(newThing, oldThing);
            }
            delete initialByKey[newThingKey];
        }
        else {
            onEnter(newThing);
        }
    }
    for (const k in initialByKey) {
        if (!general_1.hasOwnProperty(initialByKey, k))
            continue;
        onExit(initialByKey[k]);
    }
}
exports.updater = updater;
//# sourceMappingURL=updater.js.map