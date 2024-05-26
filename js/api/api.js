class Api {
  constructor(url) {
      this._url = url;
  }

  async getRecipes() {
    try {
      const response = await fetch(this._url);
      const data = await response.json();
      console.log(data);
      return this.data;
    } catch (error) {
      throw new Error('Error fetching data: ' + error);
    }
  }
}
