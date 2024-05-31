class IndexApp {
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) });
  }

  get recipes() {
      return this._recipes;
  }

  init() {
    this.displayRecipes();
    this.addListenersMainSearch();
  }

  displayRecipes(recipes = this._recipes) {
    if (recipes.length === 0) {
      document.getElementById('noRecipesContainer').classList.remove('hide');
      document.getElementById('recipesContainer').innerHTML = '';
    } else {
      document.getElementById('noRecipesContainer').classList.add('hide');
      let recipesContainer = '';
      recipes.forEach(recipe => {
        const recipeTemplate = new RecipeTemplate(recipe);
        recipesContainer += recipeTemplate.render();
      });
      document.getElementById('recipesContainer').innerHTML = recipesContainer;
    }
    document.getElementById('recipesCount').innerText = recipes.length + (recipes.length > 1 ? ' recettes' : ' recette');
  }

  addListenersMainSearch() {
    // prevent the form from being submitted
    document.getElementById('mainSearchForm').addEventListener('submit', (e) => {
      e.preventDefault();
    });
    const searchInput = document.getElementById('mainSearchInput');
    searchInput.addEventListener('input', () => {
      // if the search input is less than 3 characters, display all recipes
      if (searchInput.value.length < 3) {
        this.displayRecipes();
        return;
      }
    
      let searchResults = [];
    
      app.recipes.forEach(recipe => {
        if (recipe.search(searchInput.value) || recipe.searchIngredient(searchInput.value) || recipe.searchDescription(searchInput.value)) {
          searchResults.push(recipe);
        }
      })
    
      this.displayRecipes(searchResults);
    });
  }

  getIngredients() {
    let ingredients = [];
    this._recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredients.push(ingredient);
      });
    });
    return ingredients;
  }

  getUstensils() {
    let ustensils = [];
    this._recipes.forEach(recipe => {
      recipe.ustensils.forEach(ustensil => {
        ustensils.push(ustensil);
      });
    });
    return ustensils;
  }
}

//
const app = new IndexApp(recipes);
app.init();
