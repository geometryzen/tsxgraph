import { exists } from '../utils/exists';
import { GeometryElement, isGeometryElement } from './GeometryElement';

export class Composition {
    private readonly elements: { [id: string]: GeometryElement | Composition };
    private readonly objects: { [id: string]: GeometryElement | Composition };
    private readonly elementsByName: { [name: string]: unknown };
    private readonly objectsList: unknown[];
    private readonly groups: { [id: string]: unknown };
    private readonly methodMap: { [name: string]: unknown };
    private readonly dump: boolean;
    private readonly subs: { [x: string]: GeometryElement };
    private readonly parents: unknown[];
    private readonly elType: unknown;
    /**
     * A composition is a simple container that manages none or more {@link JXG.GeometryElement}s.
     * @param {Object} elements A list of elements with a descriptive name for the element as the key and a reference
     * to the element as the value of every list entry. The name is used to access the element later on.
     * @example
     * var p1 = board.create('point', [1, 2]),
     *     p2 = board.create('point', [2, 3]),
     *     c = new JXG.Composition({
     *         start: p1,
     *         end: p2
     *     });
     *
     * // moves p1 to [3, 3]
     * c.start.moveTo([3, 3]);
     * @class JXG.Composition
     */
    constructor(elements?: { [name: string]: Composition | GeometryElement }) {
        const genericMethods = [
            /**
             * Invokes setAttribute for every stored element with a setAttribute method and hands over the given arguments.
             * See {@link JXG.GeometryElement#setAttribute} for further description, valid parameters and return values.
             * @name setAttribute
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'setAttribute',

            /**
            * Invokes setParents for every stored element with a setParents method and hands over the given arguments.
            * See {@link JXG.GeometryElement#setParents} for further description, valid parameters and return values.
            * @name setParents
            * @memberOf JXG.Composition.prototype
            * @function
            */
            'setParents',

            /**
             * Invokes prepareUpdate for every stored element with a prepareUpdate method and hands over the given arguments.
             * See {@link JXG.GeometryElement#prepareUpdate} for further description, valid parameters and return values.
             * @name prepareUpdate
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'prepareUpdate',

            /**
             * Invokes updateRenderer for every stored element with a updateRenderer method and hands over the given arguments.
             * See {@link JXG.GeometryElement#updateRenderer} for further description, valid parameters and return values.
             * @name updateRenderer
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'updateRenderer',

            /**
             * Invokes update for every stored element with a update method and hands over the given arguments.
             * See {@link JXG.GeometryElement#update} for further description, valid parameters and return values.
             * @name update
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'update',

            /**
             * Invokes fullUpdate for every stored element with a fullUpdate method and hands over the given arguments.
             * See {@link JXG.GeometryElement#fullUpdate} for further description, valid parameters and return values.
             * @name fullUpdate
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'fullUpdate',

            /**
             * Invokes highlight for every stored element with a highlight method and hands over the given arguments.
             * See {@link JXG.GeometryElement#highlight} for further description, valid parameters and return values.
             * @name highlight
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'highlight',

            /**
             * Invokes noHighlight for every stored element with a noHighlight method and hands over the given arguments.
             * See {@link JXG.GeometryElement#noHighlight} for further description, valid parameters and return values.
             * @name noHighlight
             * @memberOf JXG.Composition.prototype
             * @function
             */
            'noHighlight'
        ]
        const generateMethod = (what: string) => {
            return () => {

                for (let i in this.elements) {
                    if (this.elements.hasOwnProperty(i)) {
                        if (exists(this.elements[i][what])) {
                            this.elements[i][what].apply(this.elements[i], arguments);
                        }
                    }
                }
                return this;
            };
        };

        for (let e = 0; e < genericMethods.length; e++) {
            this[genericMethods[e]] = generateMethod(genericMethods[e]);
        }

        this.elements = {};
        this.objects = this.elements;

        this.elementsByName = {};
        this.objectsList = [];

        // unused, required for select()
        this.groups = {};

        this.methodMap = {
            setAttribute: 'setAttribute',
            setProperty: 'setAttribute',
            setParents: 'setParents',
            add: 'add',
            remove: 'remove',
            select: 'select'
        };

        for (const e in elements) {
            if (elements.hasOwnProperty(e)) {
                this.add(e, elements[e]);
            }
        }

        this.dump = true;
        this.subs = {};
    }

    /**
     * Adds an element to the composition container.
     * @param {String} what Descriptive name for the element, e.g. <em>startpoint</em> or <em>area</em>. This is used to
     * access the element later on. There are some reserved names: <em>elements, add, remove, update, prepareUpdate,
     * updateRenderer, highlight, noHighlight</em>, and all names that would form invalid object property names in
     * JavaScript.
     * @param {JXG.GeometryElement|JXG.Composition} element A reference to the element that is to be added. This can be
     * another composition, too.
     * @returns {Boolean} True, if the element was added successfully. Reasons why adding the element failed include
     * using a reserved name and providing an invalid element.
     */
    add(what: string, element: GeometryElement | Composition): boolean {
        if (!exists(this[what]) && exists(element)) {
            if (isGeometryElement(element)) {
                this.elements[element.id] = element;
                if (exists(element.name)) {
                    this.elementsByName[element.name] = element;
                }
                element.on('attribute:name', this.nameListener, this);
            } else {
                this.elements[what] = element;
                /*
                if (exists(element.name)) {
                    this.elementsByName[element.name] = element;
                }
                element.on('attribute:name', this.nameListener, this);
                */
            }


            this.objectsList.push(element);
            this[what] = element;
            this.methodMap[what] = element;

            return true;
        }

        return false;

    }

    /**
     * Remove an element from the composition container.
     * @param {String} what The name used to access the element.
     * @returns {Boolean} True, if the element has been removed successfully.
     */
    remove(what: string): boolean {
        let found = false;

        for (const e in this.elements) {
            if (this.elements.hasOwnProperty(e)) {
                if (this.elements[e].id === this[what].id) {
                    found = true;
                    break;
                }
            }
        }

        if (found) {
            delete this.elements[this[what].id];
            delete this[what];
        }

        return found;
    }

    nameListener(oval, nval, el) {
        delete this.elementsByName[oval];
        this.elementsByName[nval] = el;
    }

    select(filter) {
        // for now, hijack JXG.Board's select() method
        if (exists(JXG.Board)) {
            return JXG.Board.prototype.select.call(this, filter);
        }

        return new Composition();
    }

    getParents() {
        return this.parents;
    }

    getType() {
        return this.elType;
    }

    getAttributes() {
        var attr = {}

        for (const e in this.subs) {
            if (this.subs.hasOwnProperty(e)) {
                attr[e] = this.subs[e].visProp;
            }
        }

        // TODO: Do we have a bug here?
        return this.attr;
    }
}
