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

      select._select.addEventListener('click', (event) => {
        event.stopPropagation();

        // if the user clicks on the select button, close the other selects
        this._advancedSearchSelects.forEach(otherSelect => {
          if (otherSelect !== select) {
            otherSelect.hideDropdown();
          }
        });

        // if the user clicks on an option, add it to the advancedCriterias
        const clickedOption = event.target.closest('[role="option"]');
        if (clickedOption) {
          const type = select.type;
          const option = clickedOption.textContent.toLowerCase();
          if (!this._advancedCriterias[type]) {
            this._advancedCriterias[type] = [];
          }
          if (!this._advancedCriterias[type].includes(option)) {
            this._advancedCriterias[type].push(option);
            this.toggleSearchTag(option, type);
            this.updateRecipes();
          }
        }

        // if the user clicks on a selected option, remove it from the advancedCriterias and remove associated tag
        const clickedSelectedOption = event.target.closest('li.custom-select__content__list__selected-item');
        if (clickedSelectedOption) {
          const type = select.type;
          const option = clickedSelectedOption.textContent.toLowerCase();
          this._advancedCriterias[type] = this._advancedCriterias[type].filter(criteria => criteria.toLowerCase() !== option);
          this.toggleSearchTag(option, type);
          this.updateRecipes();
        }
      });
    });
  }

  /**
   * Attach listeners to the main search input
   */
  attachListenersMainSearch() {
    const searchInput = document.getElementById('mainSearchInput');
    const clearSearchButton = document.getElementById('clearSearchButton');

    // clear the search input when the user clicks on the clear button
    clearSearchButton.addEventListener('click', () => {
      clearSearchButton.classList.add('hide');
      searchInput.value = '';
      searchInput.focus();
      this.displayRecipes();
    });

    // display the clear button when the user types in the search input
    searchInput.addEventListener('input', () => {
      if (searchInput.value.length > 0) {
        clearSearchButton.classList.remove('hide');
      } else {
        clearSearchButton.classList.add('hide');
      }
    });

    // search for recipes when the user submits the form
    document.getElementById('mainSearchForm').addEventListener('input', (e) => {
      e.preventDefault();

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

  // update the options for each advanced search select
  updateSelects() {
    this._advancedSearchSelects.forEach(select => {
      select.updateOptions(this.getOptions(select.type));
    });
  }

  // get the options for a criteria from the sorted recipes
  getOptions(criteria) {
    let options = [];
    this._sortedRecipes.forEach(recipe => {
      if (Array.isArray(recipe[criteria])) {
        recipe[criteria].forEach(option => {
          if (option && typeof option === 'object') {
            if (option.name && !options.includes(option.name)) {
              options.push(option.name);
            }
          } else if (option && !options.includes(option.toLowerCase())) {
            options.push(option.toLowerCase());
          }
        });
      } else {
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
