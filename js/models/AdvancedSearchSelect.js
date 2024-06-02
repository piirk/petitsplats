class AdvancedSearchSelect {
  constructor(options, type) {
    this._options = options;
    this._type = type;
    this._select = document.createElement('div');
    this._button = document.createElement('button');
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

  updateOptions(options) {
    this._options = options;
    this._dropdown.querySelector('[role="listbox"]').innerHTML = AdvancedSearchSelectTemplate.getListboxTemplate(this._options);
    this._optionsList = this._select.querySelectorAll('[role="option"]');
  }

  addListeners() {
    this._select = document.getElementById(this._type + 'Select');
    
    this._button = this._select.querySelector('[role="combobox"]');
    this._dropdown = this._select.querySelector('.custom-select__content');
    this._optionsList = this._select.querySelectorAll('[role="option"]');

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
  }

  toggleDropdown() {
    this._dropdown.classList.toggle('active');
    this._isDropdownOpen = !this._isDropdownOpen;
    this._button.setAttribute('aria-expanded', this._isDropdownOpen.toString());
  
    if (this._isDropdownOpen) {
      // todo: focus the search input
      //focusCurrentOption();
    } else {
      this._button.focus(); // focus the button when the dropdown is closed just like the select element
    }
  };

  hideDropdown() {
    this._dropdown.classList.remove('active');
    this._isDropdownOpen = false;
    this._button.setAttribute('aria-expanded', 'false');
  };

  selectOptionByElement(optionElement) {
    optionElement.classList.add('hide');
    optionElement.setAttribute('aria-selected', 'true');
  
    this._selectedOptions.push(optionElement.textContent);
    
    document.getElementById(this._type + 'SelectedOptions').innerHTML += AdvancedSearchSelectTemplate.getSelectedOptionTemplate(optionElement.textContent);
  };

  removeSelectedOption(selectedOption) {
    const optionText = selectedOption.textContent;
    this._selectedOptions = this._selectedOptions.filter(option => option !== optionText);

    const optionElement = Array.from(this._optionsList).find(option => option.textContent === optionText);
    optionElement.classList.remove('hide');
    optionElement.setAttribute('aria-selected', 'false');
  
    selectedOption.remove();
  };
}