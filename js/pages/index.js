class IndexApp {
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) });
    this._sortedRecipes = this._recipes;
    this._criteria = [];
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

  init() {
    this.displayRecipes();
    this.addListenersMainSearch();
  }

  displayRecipes() {
    const noRecipesContainer = document.getElementById('noRecipesContainer');
    
    // if there are no recipes, display a message, otherwise display the recipes
    if (this._sortedRecipes.length === 0) {
      noRecipesContainer.classList.remove('hide');
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
        <div class="search-tag">
          ${criteria}<button class="search-tag__close" aria-label="Supprimer le tag de recherche '${criteria}'"></button>
        </div>
      `;
    });
    searchTagsContainer.innerHTML = searchTags;

    // add a listener to each search tag to remove it when the user clicks on the close button
    searchTagsContainer.querySelectorAll('.search-tag__close').forEach(closeButton => {
      closeButton.addEventListener('click', (e) => {
      const criteria = e.target.parentElement.innerText;
      this._criteria = this._criteria.filter(c => c !== criteria);
      this.updateRecipes();
      this.displayRecipes();
      e.target.parentElement.remove();
      });
    });
  }

  addListenersMainSearch() {
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
      this.displayRecipes();
      this.displaySearchTags();

      searchInput.value = '';
      clearSearchButton.classList.add('hide');
    });
  }

  // update the recipes based on the criteria
  updateRecipes() {
    // if there are no criteria, display all recipes
    if (this._criteria.length === 0) {
      this._sortedRecipes = this._recipes;
      return;
    }

    // filter the recipes based on the criteria
    let searchResults = app.recipes.filter(recipe => {
      return this._criteria.every(criteria => {
      return recipe.search(criteria) || recipe.searchIngredient(criteria) 
        || recipe.searchUstensil(criteria) || recipe.searchAppliance(criteria) || recipe.searchDescription(criteria);
      });
    });

    this._sortedRecipes = searchResults;
  }

  getIngredients() {
    let ingredients = [];
    this._recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (!ingredients.includes(ingredient)) {
          ingredients.push(ingredient);
        }
      });
    });
    return ingredients;
  }

  getAppliances() {
    let appliances = [];
    this._recipes.forEach(recipe => {
      if (!appliances.includes(recipe.appliance)) {
        appliances.push(recipe.appliance);
      }
    });
    return appliances;
  }

  getUstensils() {
    let ustensils = [];
    this._recipes.forEach(recipe => {
      recipe.ustensils.forEach(ustensil => {
        if (!ustensils.includes(ustensil)) {
          ustensils.push(ustensil);
        }
      });
    });
    return ustensils;
  }
}

//
const app = new IndexApp(recipes);
app.init();

const elements = {
  button: document.querySelector('[role="combobox"]'),
  dropdown: document.querySelector('[role="listbox"]'),
}; // I like to group all my elements into one objects 🤓.
let isDropdownOpen = false;

const toggleDropdown = () => {
  elements.dropdown.classList.toggle('active');
  isDropdownOpen = !isDropdownOpen;
  elements.button.setAttribute('aria-expanded', isDropdownOpen.toString()); // update the aria-expanded state
};

elements.button.addEventListener('click', toggleDropdown);
