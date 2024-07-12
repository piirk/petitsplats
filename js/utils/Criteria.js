/**
 * Class for criteria
 * @class Criteria
 */
class Criteria {
  /**
   * Get the options from the recipe based on the criteria
   * @param {Object} recipe - The recipe object
   * @param {string} criteria - The criteria
   * @returns {Set} - The options
   */
  static getOptionsFromRecipe(recipe, criteria) {
    let options = new Set();
    if (Array.isArray(recipe[criteria])) { // if the criteria is an array, get the option from the array
      recipe[criteria].forEach(option => {
        if (option && typeof option === 'object') {
          if (option.name) {
            options.add(option.name);
          }
        } else if (option) { // if the option is a string, get the option from the string
          options.add(option.toLowerCase());
        }
      });
    } else { // if the criteria is a string, get the option from the string
      if (recipe[criteria]) {
        options.add(recipe[criteria].toLowerCase());
      }
    }
    return options;
  }

  /**
   * check if the criterias are valid
   * @param {Object} recipe - The recipe object
   * @param {string} criteria - The criteria
   * @param {Array} options - The options
   * @returns {boolean} - True if the criterias are valid, false otherwise
   */
  static isCriteriasValid(recipe, criteria, options) {
    if (options.length === 0) {
      return true;
    }
    return options.every(option => {
      return typeof recipe[criteria] === 'string' 
        ? recipe[criteria].toLowerCase() === option.toLowerCase() 
        : recipe[criteria].some(item => typeof item === 'object' && item.name 
          ? item.name.toLowerCase() === option.toLowerCase() 
          : item.toLowerCase() === option.toLowerCase());
    });
  }
}
