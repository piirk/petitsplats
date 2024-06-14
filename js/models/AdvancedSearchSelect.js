/**
 * AdvancedSearchSelect
 * Represents an advanced search select
 * @class AdvancedSearchSelect
 * @property {Array} _options - The options of the select
 * @property {String} _type - The type of the select
 * @property {HTMLElement} _select - The select element
 * @property {HTMLElement} _button - The button element
 * @property {HTMLElement} _search - The search input element
 * @property {HTMLElement} _dropdown - The dropdown element
 * @property {Array} _optionsList - The list of options
 * @property {Boolean} _isDropdownOpen - The state of the dropdown
 * @property {Number} _currentOptionIndex - The index of the current option
 * @property {Array} _selectedOptions - The list of selected options
 */
class AdvancedSearchSelect {
  /**
   * Create an advanced search select
   * @param {Array} options - The options of the select
   * @param {String} type - The type of the select
   */
  constructor(options, type) {
    this._options = options;
    this._type = type;
    this._select = document.createElement('div');
    this._button = document.createElement('button');
    this._search = document.createElement('input');
    this._dropdown = document.createElement('div');
    this._optionsList = [];
    this._isDropdownOpen = false;
    this._currentOptionIndex = 0;
    this._selectedOptions = [];
  }

  get options() {
    return this._options;
  }

  get type() {
    return this._type;
  }

  /**
   * Render the select element 
   */
  updateOptions(options) {
    this._options = options;
    this._dropdown.querySelector('[role="listbox"]').innerHTML = AdvancedSearchSelectTemplate.getListboxTemplate(this._options);
    this._optionsList = this._select.querySelectorAll('[role="option"]');

    // hide the selected options in the listbox if they are already selected
    this._selectedOptions.forEach(selectedOption => {
      const optionElement = Array.from(this._optionsList).find(option => option.textContent === selectedOption);
      if (optionElement) {
        optionElement.classList.add('hide');
        optionElement.setAttribute('aria-selected', 'true');
      } else { // if the option is not in the list, remove it from the selected options
        this._selectedOptions = this._selectedOptions.filter(option => option !== selectedOption);
        this.removeSelectedOption(document.getElementById(this._type + 'SelectedOptions').querySelector('li'));
      }
    });
  }

  /**
   * Attach listeners to the select elements
   */
  attachListeners() {
    this._select = document.getElementById(this._type + 'Select');
    
    this._button = this._select.querySelector('[role="combobox"]');
    this._search = document.getElementById(this._type + 'SelectSearch');
    this._dropdown = this._select.querySelector('.custom-select__content');
    this._optionsList = this._select.querySelectorAll('[role="option"]');

    // hide the dropdown when clicking outside
    document.addEventListener('click', () => {
      this.hideDropdown();
    });

    this._select.addEventListener('click', (event) => {
      event.stopPropagation();

      if (this._button.contains(event.target) || (!this._dropdown.contains(event.target) && this._isDropdownOpen)) {
        this.toggleDropdown();
      }

      // Check if the click is on an option
      const clickedOption = event.target.closest('[role="option"]');
      if (clickedOption) {
        this.selectOptionByElement(clickedOption);
      }
    
      // check if the click is on a selected option
      const clickedSelectedOption = event.target.closest('#' + this._type + 'SelectedOptions li');
      if (clickedSelectedOption) {
        this.removeSelectedOption(clickedSelectedOption);
      }
    });

    // search input
    this._search.addEventListener('input', () => {
      const searchValue = this._search.value.toLowerCase();
      const clearSearchButton = document.getElementById(this._type + 'SelectClearSearch');

      if (searchValue) {
        clearSearchButton.classList.remove('hide');
      } else {
        clearSearchButton.classList.add('hide');
      }

      this._optionsList.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchValue)) {
          option.classList.remove('hide');
        } else {
          option.classList.add('hide');
        }
      });
    });

    // clear search button
    const clearSearchButton = document.getElementById(this._type + 'SelectClearSearch');

    clearSearchButton.addEventListener('click', () => {
      clearSearchButton.classList.add('hide');
      this._search.value = '';
      this._search.focus();
      this._optionsList.forEach(option => option.classList.remove('hide'));
    });
  }

  /**
   * Toggle the dropdown
   */
  toggleDropdown() {
    this._dropdown.classList.toggle('active');
    this._isDropdownOpen = !this._isDropdownOpen;
    this._button.setAttribute('aria-expanded', this._isDropdownOpen.toString());
  
    if (this._isDropdownOpen) {
      this._search.focus(); // focus the search input when the dropdown is open
    } else {
      this._button.focus(); // focus the button when the dropdown is closed just like the select element
    }
  };

  /**
   * Hide the dropdown
   */
  hideDropdown() {
    this._dropdown.classList.remove('active');
    this._isDropdownOpen = false;
    this._button.setAttribute('aria-expanded', 'false');
  };

  /**
   * Select an option by element and add it to the selected options 
   * @param {HTMLElement} optionElement - The option element to select
   */
  selectOptionByElement(optionElement) {
    optionElement.classList.add('hide');
    optionElement.setAttribute('aria-selected', 'true');
  
    this._selectedOptions.push(optionElement.textContent);
    
    document.getElementById(this._type + 'SelectedOptions').innerHTML += AdvancedSearchSelectTemplate.getSelectedOptionTemplate(optionElement.textContent);
  };

  /**
   * Remove a selected option
   * @param {HTMLElement} selectedOption - The selected option to remove
   */
  removeSelectedOption(selectedOption) {
    const optionText = selectedOption.textContent;
    this._selectedOptions = this._selectedOptions.filter(option => option !== optionText);

    const optionElement = Array.from(this._optionsList).find(option => option.textContent === optionText);
    if (optionElement) {
      optionElement.classList.remove('hide');
      optionElement.setAttribute('aria-selected', 'false');
    }
  
    selectedOption.remove();
  };
}
