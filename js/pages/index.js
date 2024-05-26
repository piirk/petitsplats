class IndexApp {
  constructor(recipes) {
    this._recipes = recipes.map(recipe => { return new Recipe(recipe) })
  }


  get photographer() {
      return this._photographer
  }

  get medias() {
      return this._medias
  }
}

const app = new IndexApp();
app.fetchData();