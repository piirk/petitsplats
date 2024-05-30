class RecipeTemplate {
  constructor(recipe) {
    this._recipe = recipe;
  }

  // Method to render the recipe card
  static render() {
    return `
      <div class="recipe">
        <h2>${recipe.name}</h2>
        <p>${recipe.description}</p>
        <ul>
          ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}
