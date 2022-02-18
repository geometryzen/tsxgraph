import { assert } from 'chai';
import { Board } from '../src/base/Board';

describe("Board", function () {
    describe("constructor", function () {
        it("should return an instance of the Board.", function () {
            const board = new Board();
            assert.isDefined(board);
        });
    });
});
