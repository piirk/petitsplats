/**
 * App class
 */
class IndexApp {
  /**
   * @param {Array} recipes
   * @param {Array} advancedSearchCriterias
   */
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) });
    this._sortedRecipes = this._recipes;
    this._criteria = [];
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
      document.getElementById('noRecipesCriterias').innerHTML = this._criteria.join(', ');
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

  displaySearchTags() {
    const searchTagsContainer = document.getElementById('searchTagsContainer');
    let searchTags = '';

    searchTagsContainer.innerHTML = '';
    this._criteria.forEach(criteria => {
      searchTags += `
        <button class="search-tag btn btn-yellow btn-lg d-flex flex-row align-items-center" aria-label="Supprimer le tag de recherche '${criteria}'">
          ${criteria}<span class="search-tag__icon">&times;</span>
        </button>
      `;
    });
    searchTagsContainer.innerHTML = searchTags;

    // add a listener to each search tag to remove it when the user clicks on the tag
    searchTagsContainer.querySelectorAll('.search-tag').forEach(button => {
      button.addEventListener('click', (e) => {
      const criteria = button.innerText.replace('×', '').trim();
      this._criteria = this._criteria.filter(c => c !== criteria);
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

    // add listeners to the advanced search selects
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
            this.updateRecipes();
          }
        }

        // if the user clicks on a selected option, remove it from the advancedCriterias
        const clickedSelectedOption = event.target.closest('li.custom-select__content__list__selected-item');
        if (clickedSelectedOption) {
          const type = select.type;
          const option = clickedSelectedOption.textContent.toLowerCase();
          this._advancedCriterias[type] = this._advancedCriterias[type].filter(criteria => criteria.toLowerCase() !== option);
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
    document.getElementById('mainSearchForm').addEventListener('submit', (e) => {
      e.preventDefault();

      // if the search input is less than 3 characters, display all recipes
      if (searchInput.value.length < 3) {
        this.displayRecipes();
        return;
      }

      // add the search input to the criteria
      if (!this._criteria.includes(searchInput.value)) {
        this._criteria.push(searchInput.value);
      }
    
      this.updateRecipes();
      this.displaySearchTags();

      searchInput.value = '';
      clearSearchButton.classList.add('hide');
    });
  }

  /**
   * Update the recipes based on the criteria
   */
  updateRecipes() {
    console.log(this._advancedCriterias)
    // if there are no criterias, display all recipes
    if (this._criteria.length === 0 && Object.keys(this._advancedCriterias).length === 0) {
      this._sortedRecipes = this._recipes;
    } else {
      // filter the recipes based on the criteria
      let searchResults = app.recipes.filter(recipe => {
        return this._criteria.every(criteria => {
          return recipe.search(criteria) || recipe.searchIngredient(criteria) || recipe.searchUstensil(criteria) || recipe.searchAppliance(criteria) || recipe.searchDescription(criteria);
        }) && Object.entries(this._advancedCriterias).every(([type, options]) => {
          return options.every(option => {
            // check if the type is a string or an array
            if (typeof recipe[type] === 'string') {
              return recipe[type].toLowerCase() === option.toLowerCase();
            } else {
              return recipe[type].some(item => {
                // if the item is an object, check if the name matches the option
                if (typeof item === 'object' && item.name) {
                return item.name.toLowerCase() === option.toLowerCase();
                } else {
                return item.toLowerCase() === option.toLowerCase();
                }
              });
            }
          });
        });
      });
      this._sortedRecipes = searchResults;
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
