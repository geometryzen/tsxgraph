import { IEventEmitter } from "../utils/EventEmitter";
import { Board } from "./Board";

export class GeometryElement implements IEventEmitter {
    /**
     * Constructs a new GeometryElement object.
     * @class This is the basic class for geometry elements like points, circles and lines.
     * @constructor
     * @param {JXG.Board} board Reference to the board the element is constructed on.
     * @param {Object} attributes Hash of attributes and their values.
     * @param {Number} type Element type (a <tt>JXG.OBJECT_TYPE_</tt> value).
     * @param {Number} oclass The element's class (a <tt>JXG.OBJECT_CLASS_</tt> value).
     * @borrows JXG.EventEmitter#on as this.on
     * @borrows JXG.EventEmitter#off as this.off
     * @borrows JXG.EventEmitter#triggerEventHandlers as this.triggerEventHandlers
     * @borrows JXG.EventEmitter#eventHandlers as this.eventHandlers
     */
    constructor(board: Board, attributes: { [name: string]: unknown }, type: number, oclass: number) {
    }
    on(event: string, handler: unknown, context: unknown): this {
        // The implementation is gained through a mix-in.
        throw new Error("Method not implemented.");
    }
}