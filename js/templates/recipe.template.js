class RecipeTemplate {
  constructor(recipe) {
    this._recipe = recipe;
  }

  // Method to render the recipe card
  render() {
    return `
      <div class="card font-family-manrope">
        <img src="assets/image/recipe/${this._recipe.image}" class="card-img-top" alt="Photo du plat ${this._recipe.name}">
        <span class="badge card-badge">${this._recipe.time}min</span>
        <div class="card-body d-flex flex-column">
          <h2 class="card-title mt-3">${this._recipe.name}</h2>
          <div>
            <h3 class="card-subtitle text-uppercase">Recette</h3>
            <p class="card-text card-text-description">${this._recipe.description}</p>
          </div>
          <div>
            <h3 class="card-subtitle text-uppercase">ingrédients</h3>
            <div class="card-text">
              <ul class="ingredients-list list-group d-flex flex-row flex-wrap">
                ${this._recipe.ingredients.map(ingredient => {
                  return `
                    <li class="list-group-item">${ingredient.name}<br /><span class="ingredients-list__quantity">${ingredient.quantity + ingredient.unit}</span></li>
                  `}).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
