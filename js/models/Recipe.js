/**
 * Class representing a recipe
 * @class Recipe
 * @property {Number} _id - The recipe id
 * @property {String} _image - The recipe image
 * @property {String} _name - The recipe name
 * @property {String} _description - The recipe description
 * @property {Array} _ingredients - The recipe ingredients
 * @property {Number} _time - The recipe time
 * @property {Number} _servings - The recipe servings
 * @property {String} _appliance - The recipe appliance
 * @property {Array} _ustensils - The recipe ustensils
 */
class Recipe {
  /**
   * Create a recipe
   * @param {Object} data - The recipe data
   */
  constructor(data) {
    this._id = data.id;
    this._image = data.image;
    this._name = data.name;
    this._description = data.description;
    this._ingredients = data.ingredients.map(ingredient => { return new Ingredient(ingredient.ingredient, ingredient.quantity, ingredient.unit) });
    this._time = data.time;
    this._servings = data.servings;
    this._appliance = data.appliance;
    this._ustensils = data.ustensils;
  }

  get id() {
    return this._id;
  }

  get image() {
    return this._image;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get ingredients() {
    return this._ingredients;
  }

  get time() {
    return this._time;
  }

  get servings() {
    return this._servings;
  }

  get appliance() {
    return this._appliance;
  }

  get ustensils() {
    return this._ustensils;
  }

  /**
   * Search a recipe by name
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the query, false otherwise
   */
  search(query) {
    return this._name.toLowerCase().includes(query.toLowerCase());
  }

  /**
   * Search a recipe by ingredient
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the ingredient, false otherwise
   */
  searchIngredient(query) {
    return this._ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query.toLowerCase()));
  }

  /**
   * Search a recipe by appliance
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the appliance, false otherwise
   */
  searchAppliance(query) {
    return this._appliance.toLowerCase().includes(query.toLowerCase());
  }

  /**
   * Search a recipe by ustensil
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the ustensil, false otherwise
   */
  searchUstensil(query) {
    return this._ustensils.some(ustensil => ustensil.toLowerCase().includes(query.toLowerCase()));
  }

  /**
   * Search a recipe by description
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the description, false otherwise
   */
  searchDescription(query) {
    return this._description.toLowerCase().includes(query.toLowerCase());
  }
}
