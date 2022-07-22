/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return new proto.constructor(...Object.values(obj));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


class CssSelectorBuilder {
  constructor() {
    this.value = '';
    this.hasElement = false;
    this.hasId = false;
    this.hasClass = false;
    this.hasPseudoClass = false;
    this.hasPseudoElement = false;
  }

  element(value) {
    if (this.hasId) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.hasElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.value += value;
    this.hasElement = true;
    return this;
  }

  id(value) {
    if (this.hasId) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.hasClass) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.hasPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.value += `#${value}`;
    this.hasId = true;
    return this;
  }

  class(value) {
    if (this.attrAdded) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.value += `.${value}`;
    this.hasClass = true;
    return this;
  }

  attr(value) {
    if (this.hasPseudoClass) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.value += `[${value}]`;
    this.attrAdded = true;
    return this;
  }

  pseudoClass(value) {
    this.hasPseudoClass = true;
    if (this.hasPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.value += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.hasPseudoElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.value += `::${value}`;
    this.hasPseudoElement = true;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.value = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.value;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.element(value);
    return cssBuilder;
  },

  id(value) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.id(value);
    return cssBuilder;
  },

  class(value) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.class(value);
    return cssBuilder;
  },

  attr(value) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.attr(value);
    return cssBuilder;
  },

  pseudoClass(value) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.pseudoClass(value);
    return cssBuilder;
  },

  pseudoElement(value) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.pseudoElement(value);
    return cssBuilder;
  },

  combine(selector1, combinator, selector2) {
    const cssBuilder = new CssSelectorBuilder();
    cssBuilder.combine(selector1, combinator, selector2);
    return cssBuilder;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
