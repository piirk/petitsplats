class IndexApp {
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) })
  }

  get recipes() {
      return this._recipes
  }

  init() {
    this.displayRecipes();

    this.addListenersMainSearch();
  }

  displayRecipes() {
    let recipesContainer = '';

    this._recipes.forEach(recipe => {
      const recipeTemplate = new RecipeTemplate(recipe);
      recipesContainer += recipeTemplate.render();
    });

    document.getElementById('recipesContainer').innerHTML = recipesContainer;
  }

  addListenersMainSearch() {
    document.getElementById('mainSearchInput').addEventListener('input', () => {
      // if the search input is less than 3 characters, do nothing
      if (searchInput.value.length < 3) {
        return;
      }
    
      let searchResults = [];
    
      app.recipes.forEach(recipe => {
        if (recipe.search(searchInput.value) || recipe.searchIngredient(searchInput.value) || recipe.searchDescription(searchInput.value)) {
          searchResults.push(recipe);
        }
      })
    
      // display recipes cards: todo
      console.log(searchResults);
    });
  }

  getIngredients() {
    let ingredients = [];
    this._recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredients.push(ingredient)
      })
    })
    return ingredients
  }

  getUstensils() {
    let ustensils = [];
    this._recipes.forEach(recipe => {
      recipe.ustensils.forEach(ustensil => {
        ustensils.push(ustensil)
      })
    })
    return ustensils
  }
}

//
const app = new IndexApp(recipes);
app.init();
