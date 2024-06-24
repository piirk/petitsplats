/**
 * Class representing an ingredient.
 * @class Ingredient
 * @property {String} _name - The ingredient name
 * @property {Number} _quantity - The ingredient quantity
 * @property {String} _unit - The ingredient unit
 */
class Ingredient {
  /**
   * Create an ingredient
   * @param {String} name - The ingredient name
   * @param {Number} quantity - The ingredient quantity
   * @param {String} unit - The ingredient unit 
   */
  constructor(name, quantity, unit) {
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
  }

  get name() {
    return this._name;
  }

  get quantity() {
    return this._quantity;
  }

  get unit() {
    return this._unit;
  }

  set name(name) {
    this._name = name;
  }

  set quantity(quantity) {
    this._quantity = quantity;
  }

  set unit(unit) {
    this._unit = unit;
  }

  /**
   * Get the ingredient label
   * @returns {String} The ingredient label
   */
  getUnitLabel() {
    if (this._unit === undefined) {
      return '';
    } else if (['ml', 'cl', 'litre', 'Litre', 'litres', 'grammes', 'kg'].includes(this._unit)) {
      return '';
    }
    return this._unit;
  }

  /**
   * Get the ingredient label
   * @returns {String} The ingredient label
   */
  getQuantityLabel() {
    if (this._quantity === undefined) {
      return '';
    }
    return this._quantity;
  }
}
