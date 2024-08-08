/**
 * AdvancedSearchSelect
 * Represents an advanced search select
 * @class AdvancedSearchSelect
 * @property {Set} _options - The options of the select
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
   * @param {Set} options - The options of the select
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
    for (let i = 0; i < this._selectedOptions.length; i++) {
        const selectedOption = this._selectedOptions[i];
        let optionElement = null;
      for (let j = 0; j < this._optionsList.length; j++) {
        const option = this._optionsList[j];
        if (option.textContent === selectedOption) {
          optionElement = option;
          break;
        }
      }
      if (optionElement) {
        optionElement.classList.add('hide');
        optionElement.setAttribute('aria-selected', 'true');
      } else { // if the option is not in the list, remove it from the selected options
        this._selectedOptions.splice(i, 1);
        this.removeSelectedOption(document.getElementById(this._type + 'SelectedOptions').querySelector('li'));
        i--;
      }
    }
    
    // force the search input listener to be triggered
    this._search.dispatchEvent(new Event('input'));
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

    // click events on the select
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

    // keyboard events on the select
    this._select.addEventListener('keydown', (event) => {
      // open the dropdown with the enter or space key
      if ((event.key === 'Enter' || event.key === ' ') && !this._isDropdownOpen) {
        this.toggleDropdown();
      }

      if (this._isDropdownOpen) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          
          if (this._currentOptionIndex < this._optionsList.length - 1) {
            do {
              this._currentOptionIndex++;
            } while (this._currentOptionIndex < this._optionsList.length - 1 && this._optionsList[this._currentOptionIndex].classList.contains('hide'));
          } else {
            // if there is selected options, focus the first one
            if (this._selectedOptions.length > 0) {
              document.getElementById(this._type + 'SelectedOptions').lastElementChild.focus();
              return;
            }
            for (let i = 0; i < this._optionsList.length; i++) {
              if (!this._optionsList[i].classList.contains('hide')) {
                this._currentOptionIndex = i;
                break;
              }
            }
          }

          this._optionsList[this._currentOptionIndex].focus();
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          
          if (this._currentOptionIndex > 0) {
            do {
              this._currentOptionIndex--;
            } while (this._currentOptionIndex > 0 && (this._optionsList[this._currentOptionIndex].classList.contains('hide')));
          } else {
            // if there is selected options, focus the last one
            if (this._selectedOptions.length > 0) {
              document.getElementById(this._type + 'SelectedOptions').lastElementChild.focus();
              return;
            }
            for (let i = this._optionsList.length - 1; i >= 0; i--) {
              if (!this._optionsList[i].classList.contains('hide')) {
                this._currentOptionIndex = i;
                break;
              }
            }
          }

          this._optionsList[this._currentOptionIndex].focus();
        }
          
        // close the dropdown with the escape key
        if (event.key === 'Escape') {
          this.hideDropdown();
        }

        // if alphanumeric key is pressed, focus the search input
        if (event.key.match(/^[a-zA-Z0-9]$/)) {
          this._search.focus();
        }
      }
    });

    // search input
    this._search.addEventListener('input', () => {
      const searchValue = this._search.value.toLowerCase();
      const clearSearchButton = document.getElementById(this._type + 'SelectClearSearch');

      // show the clear search button if the search input is not empty
      if (searchValue) {
        clearSearchButton.classList.remove('hide');
      } else {
        clearSearchButton.classList.add('hide');
      }

      // hide the options that do not match the search value
      this._optionsList.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchValue) && this._selectedOptions.indexOf(option.textContent) === -1){
          option.classList.remove('hide');
          option.setAttribute('tabindex', this._isDropdownOpen ? '0' : '-1');
        } else {
          option.classList.add('hide');
          option.setAttribute('tabindex', '-1');
        }
      });

      // if no option is found, set the current option index to 0
      if (this._currentOptionIndex === -1) {
        this._currentOptionIndex = 0;
      }
    });

    // clear search button
    const clearSearchButton = document.getElementById(this._type + 'SelectClearSearch');
    clearSearchButton.addEventListener('click', () => {
      clearSearchButton.classList.add('hide');
      this._search.value = '';
      this._search.focus();
      
      if (this._selectedOptions.length === 0) {
        this._optionsList.forEach(option => option.classList.remove('hide'));
      } else {
        this._optionsList.forEach(option => {
          if (this._selectedOptions.indexOf(option.textContent) === -1) {
            option.classList.remove('hide');
          }
        });
      }
    });
  }

  /**
   * Toggle the dropdown
   */
  toggleDropdown(hide = false) {
    if (!this._isDropdownOpen && !hide) {
      this._dropdown.classList.add('active');
      this._isDropdownOpen = true;
      this._button.setAttribute('aria-expanded', 'true');
      this._search.setAttribute('tabindex', '0'); // add the search input to the tab order when the dropdown is open
      this._search.focus(); // focus the search input when the dropdown is open
      this._optionsList.forEach(option => option.setAttribute('tabindex', '0')); // add the options to the tab order when the dropdown is open
    } else if (this._isDropdownOpen) {
      this._dropdown.classList.remove('active');
      this._isDropdownOpen = false;
      this._button.setAttribute('aria-expanded', 'false');
      this._search.value = ''; // clear the search input when the dropdown is closed
      this._search.dispatchEvent(new Event('input')); // force the listener from search input to be triggered
      this._search.setAttribute('tabindex', '-1'); // remove the search input from the tab order when the dropdown is closed
      this._optionsList.forEach(option => option.setAttribute('tabindex', '-1')); // remove the options from the tab order when the dropdown is closed
    } 
  };

  /**
   * Hide the dropdown
   */
  hideDropdown() {
    this.toggleDropdown(true);
  }

  /**
   * Clear the selected items
   */
  clearSelectedItems() {
    this._selectedOptions = [];
    document.getElementById(this._type + 'SelectedOptions').innerHTML = '';
    this._optionsList.forEach(option => option.classList.remove('hide'));
  }

  /**
   * Select an option by element and add it to the selected options 
   * @param {HTMLElement} optionElement - The option element to select
   */
  selectOptionByElement(optionElement) {
    optionElement.classList.add('hide');
    optionElement.setAttribute('aria-selected', 'true');
  
    this._selectedOptions.push(optionElement.textContent);
    
    this._search.dispatchEvent(new Event('input'));
    document.getElementById(this._type + 'SelectedOptions').innerHTML += AdvancedSearchSelectTemplate.getSelectedOptionTemplate(optionElement.textContent);
  };

  /**
   * Remove a selected option
   * @param {HTMLElement} selectedOption - The selected option to remove
   */
  removeSelectedOption(selectedOption) {
    const optionText = selectedOption.textContent;

    const updatedSelectedOptions = [];
    for (let i = 0; i < this._selectedOptions.length; i++) {
      const option = this._selectedOptions[i];
      if (option !== optionText) {
      updatedSelectedOptions.push(option);
      }
    }
    this._selectedOptions = updatedSelectedOptions;

    let optionElement;
    let i = 0;
    while (i < this._optionsList.length && !optionElement) {
      const option = this._optionsList[i];
      if (option.textContent === optionText) {
      optionElement = option;
      }
      i++;
    }

    if (optionElement) {
      optionElement.classList.remove('hide');
      optionElement.setAttribute('aria-selected', 'false');
    }
  
    this._search.dispatchEvent(new Event('input'));
    selectedOption.remove();
  };
}
