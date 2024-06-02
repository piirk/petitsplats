class AdvancedSearchSelectTemplate {
  constructor(select) {
    this._select = select;
  }

  render() {
    return `
      <div id="${this._select.type}Select" class="custom-select">
        <label class="d-none" for="${this._select.type}">${this._select.type}</label>
        <button
          role="combobox"
          id="${this._select.type}"
          value="Select"
          aria-controls="listboxIngredients"
          aria-haspopup="listboxIngredients"
          tabindex="0"
          aria-expanded="false">
          ${this._select.type}</button>
        <div class="custom-select__content">
          <ul id="${this._select.type}SelectedOptions">

          </ul>
          <ul role="listbox" id="${this._select.type}ListboxIngredients">
          ${this._select.options.map(option => {
            return `
              <li role="option">${capitalizeFirstLetter(option)}</li>
            `;
          }).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}