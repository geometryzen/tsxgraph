import { exists } from '../utils/exists';
import { GeometryElement } from './GeometryElement';

export class Composition {
    private readonly elements: { [id: string]: GeometryElement | Composition } = {};
    constructor(elements: unknown) {

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
            if (exists(element.id)) {
                this.elements[element.id] = element;
            } else {
                this.elements[what] = element;
            }

            if (exists(element.name)) {
                this.elementsByName[element.name] = element;
            }

            element.on('attribute:name', this.nameListener, this);

            this.objectsList.push(element);
            this[what] = element;
            this.methodMap[what] = element;

            return true;
        }

        return false;

    }
}
