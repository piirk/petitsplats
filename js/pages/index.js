/**
 * App class
 */
class IndexApp {
  /**
   * @param {Array} recipes
   */
  constructor(recipes) {
    this._recipes = [];
    for (let i = 0; i < recipes.length; i++) {
      this._recipes.push(new Recipe(recipes[i]));
    }
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

      for (let i = 0; i < this._sortedRecipes.length; i++) {
        const recipe = this._sortedRecipes[i];
        const recipeTemplate = new RecipeTemplate(recipe);
        recipesContainer += recipeTemplate.render();
      }
      
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
    for (let i = 0; i < this._advancedSearchCriterias.length; i++) {
      const criteria = this._advancedSearchCriterias[i];
      this._advancedSearchSelects.push(new AdvancedSearchSelect(this.getOptions(criteria), criteria));
    }

    // render the advanced search selects
    for (let i = 0; i < this._advancedSearchSelects.length; i++) {
      const selectTemplate = new AdvancedSearchSelectTemplate(this._advancedSearchSelects[i]);
      document.getElementById('advancedSearchContainer').innerHTML += selectTemplate.render();
    }

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
        this._criteria = searchInput.value.trim().toLowerCase();
      }

      this.updateRecipesFromMainSearch();
      this.displayRecipesAndUpdateSelects();
    }

    // search for recipes when the user updates the search input
    document.getElementById('mainSearchForm').addEventListener('input', (e) => {
      mainSearchFormEvent(e);
    });

    // search for recipes when the user submits the search form
    document.getElementById('mainSearchForm').addEventListener('submit', (e) => {
      mainSearchFormEvent(e);
    });
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
   */
  updateRecipesFromMainSearch() {
    // if there are no criterias, display all recipes
    if (this.criteria === '') {
      this._sortedRecipes = this._recipes;
    } else {
      // filters the recipes based on the main criteria (search input)
      let sortedRecipes = [];

      for (let i = 0; i < this._recipes.length; i++) {
        const recipe = this._recipes[i];
        if (
          recipe.search(this._criteria) ||
          recipe.searchIngredient(this._criteria) ||
          recipe.searchUstensil(this._criteria) ||
          recipe.searchAppliance(this._criteria) ||
          recipe.searchDescription(this._criteria)
        ) {
          sortedRecipes.push(recipe);
        }
      }

      // update the sorted recipes
      this._sortedRecipes = sortedRecipes;
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
   * @returns {Array} The options
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
