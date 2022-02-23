import { exists } from "./exists";

/**
 * Creates a deep copy of an existing object, i.e. arrays or sub-objects are copied component resp.
 * element-wise instead of just copying the reference. If a second object is supplied, the two objects
 * are merged into one object. The properties of the second object have priority.
 * @param {Object} obj This object will be copied.
 * @param {Object} obj2 This object will merged into the newly created object
 * @param {Boolean} [toLower=false] If true the keys are convert to lower case. This is needed for visProp, see JXG#copyAttributes
 * @returns {Object} copy of obj or merge of obj and obj2.
 */
export function deepCopy(obj: unknown, obj2?: unknown, toLower = false): unknown {

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // missing hasOwnProperty is on purpose in this function
    if (Array.isArray(obj)) {
        const c = [];
        for (let i = 0; i < obj.length; i++) {
            const prop = obj[i];
            if (typeof prop === 'object') {
                // We certainly do not want to recurse into a JSXGraph object.
                // This would for sure result in an infinite recursion.
                // As alternative we copy the id of the object.
                if (exists(prop.board)) {
                    c[i] = prop.id;
                } else {
                    c[i] = deepCopy(prop);
                }
            } else {
                c[i] = prop;
            }
        }
        return c;
    } else {
        const c = {};
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                const i2 = toLower ? i.toLowerCase() : i;
                const prop = obj[i];
                if (prop !== null && typeof prop === 'object') {
                    if (exists(prop.board)) {
                        c[i2] = prop.id;
                    } else {
                        c[i2] = deepCopy(prop);
                    }
                } else {
                    c[i2] = prop;
                }
            }
        }

        for (const i in obj2 as {}) {
            if (obj2.hasOwnProperty(i)) {
                const i2 = toLower ? i.toLowerCase() : i;

                const prop = obj2[i];
                if (typeof prop === 'object') {
                    if (Array.isArray(prop) || !exists(c[i2])) {
                        c[i2] = deepCopy(prop);
                    } else {
                        c[i2] = deepCopy(c[i2], prop, toLower);
                    }
                } else {
                    c[i2] = prop;
                }
            }
        }

        return c;
    }
}
