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

const app = new IndexApp(recipes);
console.log(app.getUstensils());