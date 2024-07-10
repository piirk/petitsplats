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
    for (let i = 0; i < this._name.length; i++) {
      if (this._name[i].toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Search a recipe by ingredient
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the ingredient, false otherwise
   */
  searchIngredient(query) {
    for (let i = 0; i < this._ingredients.length; i++) {
      if (this._ingredients[i].name.toLowerCase() === query.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Search a recipe by appliance
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the appliance, false otherwise
   */
  searchAppliance(query) {
    for (let i = 0; i < this._appliance.length; i++) {
      if (this._appliance[i].toLowerCase() === query.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Search a recipe by ustensil
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the ustensil, false otherwise
   */
  searchUstensil(query) {
    for (let i = 0; i < this._ustensils.length; i++) {
      if (this._ustensils[i].toLowerCase() === query.toLowerCase()) {
      return true;
      }
    }
    return false;
  }

  /**
   * Search a recipe by description
   * @param {string} query - The query to search
   * @returns {boolean} True if the recipe contains the description, false otherwise
   */
  searchDescription(query) {
    for (let i = 0; i < this._description.length; i++) {
      if (this._description[i].toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
}
