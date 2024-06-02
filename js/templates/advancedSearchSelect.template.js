class AdvancedSearchSelectTemplate {
  constructor(select) {
    this._select = select;
  }

  render() {
    console.log(this._select.options);
    return `
      <div class="advanced-search-select">
        <label for="${this._select.type}" class="advanced-search-select__label">${this._select.type}</label>
        <select id="${this._select.type}" class="advanced-search-select__select">
          <option value="">Choisir un ${this._select.type}</option>
          ${this._select.options.map(option => {
            return `
              <option value="${option}">${option}</option>
            `;
          }).join('')}
        </select>
      </div>
    `;
  }
}