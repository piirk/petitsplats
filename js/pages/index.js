class IndexApp {
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) })
  }

  get recipes() {
      return this._recipes
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

//app.init();

// event listeners
const searchInput = document.getElementById('mainSearchInput');

// main search form submit event listener
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
