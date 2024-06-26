/**
 * App class
 */
class IndexApp {
  /**
   * @param {Array} recipes
   */
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) });
    this._sortedRecipes = this._recipes;
    this._criteria = '';
    this._advancedSearchCriterias = ['ingredients', 'ustensils', 'appliance'];
    this._advancedSearchSelects = [];
    this._advancedCriterias = [];
  }

  get recipes() {
      return this._recipes;
  }

  get sortedRecipes() {
    return this._sortedRecipes;
  }

  get criteria() {
    return this._criteria;
  }

  set criteria(criteria) {
    this._criteria = criteria;
  }

  /**
   * Initialize the app
   */
  init() {
    this.displayRecipes();
    this.attachListenersMainSearch();
    this.createAdvancedSearchSelects();
  }

  /**
   * Display the recipes
   */
  displayRecipes() {
    const noRecipesContainer = document.getElementById('noRecipesContainer');
    
    // if there are no recipes, display a message, otherwise display the recipes
    if (this._sortedRecipes.length === 0) {
      noRecipesContainer.classList.remove('hide');
      document.getElementById('noRecipesCriterias').innerHTML = this._criteria;
      document.getElementById('recipesContainer').innerHTML = '';
    } else {
      noRecipesContainer.classList.add('hide');
      let recipesContainer = '';
      this._sortedRecipes.forEach(recipe => {
        const recipeTemplate = new RecipeTemplate(recipe);
        recipesContainer += recipeTemplate.render();
      });
      document.getElementById('recipesContainer').innerHTML = recipesContainer;
    }

    // update the recipes count
    document.getElementById('recipesCount').innerText = this._sortedRecipes.length + (this._sortedRecipes.length > 1 ? ' recettes' : ' recette');
  }

  /**
   * Toggle the search tag
   */
  toggleSearchTag(criteria, type) {
    criteria = criteria.toLowerCase();
    // if the tag already exists, remove it
    if (document.getElementById('searchTagsContainer').querySelector(`.search-tag[aria-type="${type}"][aria-name="${criteria}"]`)) {
      document.getElementById('searchTagsContainer').querySelector(`.search-tag[aria-type="${type}"][aria-name="${criteria}"]`).remove();
    } else {
      document.getElementById('searchTagsContainer').innerHTML += TagTemplate.getTagTemplate(criteria, type);
      this.attachListenersSearchTags();
    }
  }

  /**
   * Attach listeners to the search tags
   * When the user clicks on a tag, remove the criteria from the criterias
   * Update the recipes and the search tags
   */
  attachListenersSearchTags() {
    document.getElementById('searchTagsContainer').querySelectorAll('.search-tag').forEach(button => {
      button.addEventListener('click', (e) => {
        const tagOption = button.innerText.replace('×', '').trim();

        // remove the selected items from the advancedCriterias
        this._advancedCriterias[button.getAttribute('aria-type')] = this._advancedCriterias[button.getAttribute('aria-type')].filter(c => c !== button.innerText.replace('×', '').trim());
        
        // remove the selected items from select
        const select = this._advancedSearchSelects.find(select => select.type === button.getAttribute('aria-type'));
        if (Array.from(select._optionsList).find(option => option.textContent.toLowerCase() === tagOption)) {
          select._selectedOptions = select._selectedOptions.filter(option => option !== tagOption);
          // remove the selected option from the list
          document.getElementById(select.type + 'SelectedOptions').querySelectorAll('li').forEach(selectedOption => {
            if (selectedOption.textContent.toLowerCase() === tagOption) {
              select.removeSelectedOption(selectedOption);
            }
          });
        }

        this.updateRecipes();
        button.remove();
      });
    });
  }

  /**
   * Create the advanced search selects
   */
  createAdvancedSearchSelects() {
    // create the advanced search selects objects
    this._advancedSearchCriterias.forEach(criteria => {
      this._advancedSearchSelects.push(new AdvancedSearchSelect(this.getOptions(criteria), criteria));
    });

    // render the advanced search selects
    this._advancedSearchSelects.forEach(select => {
      const selectTemplate = new AdvancedSearchSelectTemplate(select);
      document.getElementById('advancedSearchContainer').innerHTML += selectTemplate.render();
    });

    // attach listeners to the advanced search selects
    this.attachListenersAdvancedSearch();
  }

  /**
   * Attach listeners to the advanced search selects
   */
  attachListenersAdvancedSearch() {
    this._advancedSearchSelects.forEach(select => {
      select.attachListeners();

      select._select.addEventListener('click', (e) => {
        e.stopPropagation();

        // if the user clicks on the select button, close the other selects
        this._advancedSearchSelects.forEach(otherSelect => {
          if (otherSelect !== select) {
            otherSelect.hideDropdown();
          }
        });

        // if the user clicks on an option, add it to the advancedCriterias
        const clickedOption = e.target.closest('[role="option"]');
        this.addAdvancedSelectOption(select.type, clickedOption);

        // if the user clicks on a selected option, remove it from the advancedCriterias and remove associated tag
        const clickedSelectedOption = e.target.closest('li.custom-select__content__list__selected-item');
        this.removeAdvancedSelectOption(select.type, clickedSelectedOption);
      });

      select._select.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          
          if (select._isDropdownOpen) {
            // if it's a selected option, remove it
            console.log(document.getElementById(select._type + 'SelectedOptions'));
            const focusedOption = document.getElementById(select._type + 'SelectedOptions').querySelector('li:focus');
            if (focusedOption) {
              this.removeAdvancedSelectOption(select._type, focusedOption);
            }

            // if it's an option, add it
            const focusedListOption = document.getElementById(select._type + 'Listbox').querySelector('li:focus');
            if (focusedListOption) {
              this.addAdvancedSelectOption(select._type, focusedListOption);
            }
          }
        }
      });
    });
  }

  /**
   * Add an option to the advanced criterias
   * @param {string} type - The type of the criteria
   * @param {Element} option - The option to add
   */
  addAdvancedSelectOption(type, option) {
    if (option) {
      const optionText = option.textContent.toLowerCase();
      if (!this._advancedCriterias[type]) {
        this._advancedCriterias[type] = [];
      }
      if (!this._advancedCriterias[type].includes(optionText)) {
        this._advancedCriterias[type].push(optionText);
        this.toggleSearchTag(optionText, type);
        this.updateRecipes();
      }
    }
  }

  /**
   * Remove an option from the advanced criterias
   * @param {string} type - The type of the criteria
   * @param {Element} option - The option to remove
   */
  removeAdvancedSelectOption(type, option) {
    if (option) {
      const optionText = option.textContent.toLowerCase();
      this._advancedCriterias[type] = this._advancedCriterias[type].filter(criteria => criteria.toLowerCase() !== optionText);
      this.toggleSearchTag(optionText, type);
      this.updateRecipes();
    }
  }

  /**
   * Attach listeners to the main search input
   */
  attachListenersMainSearch() {
    const searchInput = document.getElementById('mainSearchInput');
    const clearSearchButton = document.getElementById('clearSearchButton');

    // clear the search input when the user clicks on the clear button
    clearSearchButton.addEventListener('click', (e) => {
      e.preventDefault();

      clearSearchButton.classList.add('hide');
      searchInput.value = '';
      searchInput.focus();
      document.getElementById('mainSearchForm').dispatchEvent(new Event('input'));
    });

    // display the clear button when the user types in the search input
    searchInput.addEventListener('input', () => {
      if (searchInput.value.length > 0) {
        clearSearchButton.classList.remove('hide');
      } else {
        clearSearchButton.classList.add('hide');
      }
    });

    // search for recipes when the user updates the search input
    document.getElementById('mainSearchForm').addEventListener('input', (e) => {
      e.preventDefault();

      // remove the search tags and advanced criterias
      document.getElementById('searchTagsContainer').innerHTML = '';
      this._advancedCriterias = {};

      // clear the advanced search selected items
      this._advancedSearchSelects.forEach(select => {
        select.clearSelectedItems();
      });

      // if the search input is less than 3 characters, display all recipes
      if (searchInput.value.length < 3) {
        this.criteria = '';
        this.displayRecipes();
        return;
      }

      // add the search input to the criteria
      this.criteria = searchInput.value.trim().toLowerCase();
    
      this.updateRecipes();
    });
  }

  /**
   * Update the recipes based on the criteria
   */
  updateRecipes() {
    // if there are no criterias, display all recipes
    if (this.criteria === '' && Object.values(this._advancedCriterias).every(options => options.length === 0)) {
      this._sortedRecipes = this._recipes;
    } else {
      // filter the recipes based on the criteria
      this._sortedRecipes = app.recipes.filter(recipe => {
        return recipe.search(this._criteria) || recipe.searchIngredient(this._criteria) || recipe.searchUstensil(this._criteria) || recipe.searchAppliance(this._criteria) || recipe.searchDescription(this._criteria);
      }).filter(recipe => {
        return Object.entries(this._advancedCriterias).every(([type, options]) => {
          
          if (options.length === 0) {
            return true;
          }

          return options.every(option => {
            // check if the type is a string or an array
            return typeof recipe[type] === 'string' 
              ? recipe[type].toLowerCase() === option.toLowerCase() 
              : recipe[type].some(item => typeof item === 'object' && item.name 
                ? item.name.toLowerCase() === option.toLowerCase() 
                : item.toLowerCase() === option.toLowerCase());
          });

        });
      });
    }
    
    this.displayRecipes();
    this.updateSelects();
  }

  /**
   * Update the advanced search selects
   * Update the options based on the sorted recipes
   */
  updateSelects() {
    this._advancedSearchSelects.forEach(select => {
      select.updateOptions(this.getOptions(select.type));
    });
  }

  /**
   * Get the options based on the criteria
   * @param {string} criteria - The criteria to get the options from
   * @returns {Array} The options
   */
  getOptions(criteria) {
    let options = [];
    this._sortedRecipes.forEach(recipe => {

      // if the criteria is an array, get the options from the array
      if (Array.isArray(recipe[criteria])) {

        recipe[criteria].forEach(option => {
          // if the option is an object, get the name property
          if (option && typeof option === 'object') {
            if (option.name && !options.includes(option.name)) {
              options.push(option.name);
            }
          } else if (option && !options.includes(option.toLowerCase())) { // if the option is a string, get the option from the string
            options.push(option.toLowerCase());
          }
        });

      } else { // if the criteria is a string, get the option from the string

        if (recipe[criteria] && !options.includes(recipe[criteria].toLowerCase())) {
          options.push(recipe[criteria].toLowerCase());
        }
        
      }
    });
    return options;
  }
}

//
const app = new IndexApp(recipes);
app.init();
