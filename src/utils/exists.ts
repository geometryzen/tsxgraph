/**
 * Checks if a given variable is neither undefined nor null. You should not use this together with global
 * variables!
 * @param v A variable of any type.
 * @param If set to true, it is also checked whether v is not equal to ''.
 * @returns True, if v is neither undefined nor null.
 */
export function exists(v: unknown, checkEmptyString = false): boolean {
    /* eslint-disable eqeqeq */
    const result = !(v == undefined || v === null);
    /* eslint-enable eqeqeq */
    checkEmptyString = checkEmptyString || false;

    if (checkEmptyString) {
        return result && v !== '';
    }
    return result;
}
