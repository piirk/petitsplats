/**
 * Template for the advanced search select component
 */
class AdvancedSearchSelectTemplate {
  /**
   * Constructor
   * @param {AdvancedSearchSelect} select - The select to render
   */
  constructor(select) {
    this._select = select;
    this._name = select.type === 'ingredients' ? 'Ingrédients' : select.type === 'appliance' ? 'Appareils' : select.type === 'ustensils' ? 'Ustensiles' : '';
  }

  /**
   * Render the select template
   * @returns {string} The select template
   */
  render() {
    return `
      <div id="${this._select.type}Select" class="custom-select">
        <label class="d-none" for="${this._select.type}">${this._name}</label>
        <button
          role="combobox"
          id="${this._select.type}"
          class="custom-select__label"
          value="Select"
          aria-controls="${this._select.type}Listbox"
          aria-haspopup="${this._select.type}Listbox"
          tabindex="0"
          aria-expanded="false">
          ${this._name}</button>
        <div class="custom-select__content">

          <label class="d-none" for="${this._select.type}SelectSearch">Rechercher un ${this._name}</label>
          <input id="${this._select.type}SelectSearch" class="custom-select__content__search form-control d-inline-block align-middle" type="text">
          <button id="${this._select.type}SelectClearSearch" class="custom-select__content__clear" aria-label="Effacer la recherche">&times;</button>

          <div class="custom-select__content__list">
            <ul id="${this._select.type}SelectedOptions">

            </ul>
            <ul id="${this._select.type}Listbox" role="listbox">
              ${AdvancedSearchSelectTemplate.getListboxTemplate(this._select.options)}
            </ul>
          </div>

        </div>
      </div>
    `;
  }

  /**
   * Get the listbox template
   * @param {Array} options - The options to render
   * @returns {string} The listbox template
   */
  static getListboxTemplate(options) {
    return `
      ${options.map(option => {
        return `
          <li class="custom-select__content__list__item" role="option">${capitalizeFirstLetter(option)}</li>
        `;
      }).sort().join('')}
    `;
  }

  /**
   * Get the selected option template
   * @param {string} option - The option to render
   * @returns {string} The selected option template
   */
  static getSelectedOptionTemplate(option) {
    return `
      <li class="custom-select__content__list__selected-item">${option}</li>
    `;
  }
}
