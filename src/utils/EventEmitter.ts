export interface IEventEmitter {
    on(event: string, handler: unknown, context: unknown): this
}

export const EventEmitter: IEventEmitter = {
    on: function () {
        throw new Error("EventEmitter.on not implemented.");
    }
}