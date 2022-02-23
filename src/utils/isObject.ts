/**
 * Tests if the input variable is an Object
 * @param v
 */
export function isObject(v: unknown): boolean {
    return typeof v === 'object' && !Array.isArray(v);
}