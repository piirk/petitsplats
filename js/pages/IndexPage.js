/**
 * App class
 */
class IndexApp {
  /**
   * @param {Array} recipes
   */
  constructor(recipes) {
    this._recipes = recipes.map(recipe => new Recipe(recipe));
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
   * Toggle the search tag based
   * @param {string} criteria - The criteria to add or remove
   * @param {string} type - The type of the criteria
   */
  toggleSearchTag(criteria, type) {
    criteria = criteria.toLowerCase();
    const searchTagsContainer = document.getElementById('searchTagsContainer');
    const existingTag = searchTagsContainer.querySelector(`.search-tag[aria-type="${type}"][aria-name="${criteria}"]`);

    if (existingTag) {
      existingTag.remove();
    } else {
      searchTagsContainer.innerHTML += TagTemplate.getTagTemplate(criteria, type);
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

        this.updateRecipesFromSelect();
        this.displayRecipesAndUpdateSelects();

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
            const focusedOption = document.getElementById(select._type + 'SelectedOptions').querySelector('li:focus');
            if (focusedOption) {
              this.removeAdvancedSelectOption(select._type, focusedOption);
              select.removeSelectedOption(focusedOption);
              select._currentOptionIndex = 0;
              select._search.focus();
            }

            // if it's an option, add it
            const focusedListOption = document.getElementById(select._type + 'Listbox').querySelector('li:focus');
            if (focusedListOption) {
              this.addAdvancedSelectOption(select._type, focusedListOption);
              select.selectOptionByElement(focusedListOption);
              document.getElementById(select._type + 'SelectedOptions').lastElementChild.focus();
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
        this.updateRecipesFromSelect();
        this.displayRecipesAndUpdateSelects();
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
      this.updateRecipesFromSelect();
      this.displayRecipesAndUpdateSelects();
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

    // fonction pour l'input et le submit
    const mainSearchFormEvent = (e) => {
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
        this._criteria = '';
      } else {
        this._criteria = searchInput.value.trim().toLowerCase().replace(/<[^>]*>?/gm, '');
      }

      this.updateRecipesFromMainSearch();
      this.displayRecipesAndUpdateSelects();
    }

    // search for recipes when the user updates the search input or submits the search form
    document.getElementById('mainSearchForm').addEventListener('input', mainSearchFormEvent);
    document.getElementById('mainSearchForm').addEventListener('submit', mainSearchFormEvent);
  }

  /**
   * Update the recipes based on the advanced criterias (selects)
   */
  updateRecipesFromSelect() {
    this.updateRecipesFromMainSearch();

    this._sortedRecipes = this._sortedRecipes.filter(recipe => {
      return Object.entries(this._advancedCriterias).every(([criteria, options]) => {
        return Criteria.isCriteriasValid(recipe, criteria, options);
      });
    });
  }

  /**
   * update the recipes from the main search
   * if there are no criterias, display all recipes
   * otherwise, filter the recipes based on the main criteria (on the name, ingredients and description)
   */
  updateRecipesFromMainSearch() {
    // if there are no criterias, display all recipes
    if (this._criteria === '') {
      this._sortedRecipes = this._recipes;
    } else {
      // filters the recipes based on the main criteria (on the name, ingredients and description)
      this._sortedRecipes = [];
      
      for (const recipe in this._recipes) {
        if (
          this._recipes[recipe].search(this._criteria) ||
          this._recipes[recipe].searchIngredient(this._criteria) ||
          this._recipes[recipe].searchDescription(this._criteria)
        ) {
          this._sortedRecipes.push(this._recipes[recipe]);
        }
      }
    }
  }

  /**
   * display the recipes and update the selects based on the sorted recipes
   */
  displayRecipesAndUpdateSelects() {
    this.displayRecipes();

    // update the options based on the sorted recipes
    this._advancedSearchSelects.forEach(select => {
      select.updateOptions(this.getOptions(select.type));
    });
  }

  /**
   * Get the options based on the criteria
   * @param {string} criteria - The criteria to get the options from
   * @returns {Set} - The options
   */
  getOptions(criteria) {
    let options = new Set();
    this._sortedRecipes.forEach(recipe => {
      options = options.symmetricDifference(Criteria.getOptionsFromRecipe(recipe, criteria));
    });
    return options;
  }
}

//
const app = new IndexApp(recipes);
app.init();
