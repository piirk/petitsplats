/**
 * TagTemplate
 */
class TagTemplate {
  /**
   * Get tag template
   * @param {string} tag - The tag to render
   * @returns {string} The tag template
   */
  static getTagTemplate(tag, type) {
      return `
        <button class="search-tag btn btn-yellow btn-lg d-flex flex-row align-items-center" aria-type="${type}" aria-label="Supprimer le tag de recherche '${tag}'">
          ${tag}<span class="search-tag__icon">&times;</span>
        </button>
      `;
  }
}
