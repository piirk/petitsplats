class AdvancedSearchSelect {
  constructor(options, type) {
    this._options = options;
    this._type = type;
  }

  get options() {
    return this._options;
  }

  get type() {
    return this._type;
  }
}