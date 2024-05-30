class Ingredient {
  constructor(name, quantity, unit) {
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
  }

  get name() {
    return this._name;
  }

  get quantity() {
    if (this._quantity === undefined) {
      return '';
    }
    return this._quantity;
  }

  get unit() {
    if (this._unit === undefined) {
      return '';
    }
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
}
