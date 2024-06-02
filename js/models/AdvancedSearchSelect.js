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

  addListeners() {
    this._select = document.getElementById(this._type + 'Select');
    
    this._button = this._select.querySelector('[role="combobox"]');
    this._dropdown = this._select.querySelector('.custom-select__content');
    this._optionsList = this._select.querySelectorAll('[role="option"]');

    document.addEventListener('click', (event) => {
      //event.stopPropagation();
      
      if (this._button.contains(event.target) || (!this._dropdown.contains(event.target) && this._isDropdownOpen)) {
        this.toggleDropdown();
      }
    
      // Check if the click is on an option
      const clickedOption = event.target.closest('[role="option"]');
      if (clickedOption) {
        selectOptionByElement(clickedOption);
      }
    
      // check if the click is on a selected option
      const clickedSelectedOption = event.target.closest('#' + this._type + 'selectedOptions li');
      if (clickedSelectedOption) {
        removeSelectedOption(clickedSelectedOption);
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
}