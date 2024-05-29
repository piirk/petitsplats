class Recipe {
  constructor(data) {
    this._id = data.id
    this._name = data.name
    this._description = data.description
    this._ingredients = data.ingredients.map(ingredient => { return new Ingredient(ingredient.ingredient, ingredient.quantity, ingredient.unit) });
    this._time = data.time
    this._servings = data.servings
    this._appliance = data.appliance
    this._ustensils = data.ustensils
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get description() {
    return this._description
  }

  get ingredients() {
    return this._ingredients
  }

  get time() {
    return this._time
  }

  get servings() {
    return this._servings
  }

  get appliance() {
    return this._appliance
  }

  get ustensils() {
    return this._ustensils
  }

  // Method to search a recipe by a query
  search(query) {
    return this._name.toLowerCase().includes(query.toLowerCase())
  }

  // Method to search a recipe by an ingredient
  searchIngredient(query) {
    return this._ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query.toLowerCase()))
  }

  // Method to search a recipe by an appliance
  searchAppliance(query) {
    return this._appliance.toLowerCase().includes(query.toLowerCase())
  }

  // Method to search a recipe by an ustensil
  searchUstensil(query) {
    return this._ustensils.some(ustensil => ustensil.toLowerCase().includes(query.toLowerCase()))
  }

  // Method to search a recipe by description
  searchDescription(query) {
    return this._description.toLowerCase().includes(query.toLowerCase())
  }
}