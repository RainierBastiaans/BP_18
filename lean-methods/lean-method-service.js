class LeanMethodService {
  constructor() {
    this.leanMethods = new Map(); // Initialize with a Map
  }

  async fetchLeanMethods() {
    try {
      const response = await fetch('./db/leanmethods.json'); // Adjust path as needed
      if (!response.ok) {
        throw new Error(`Failed to fetch lean methods: ${response.statusText}`);
      }
      const data = await response.json();
      const leanMethodData = data.leanMethods; // Assuming "leanMethods" property in JSON

      // Validate data structure (optional but recommended)
      if (!Array.isArray(leanMethodData)) {
        throw new Error('Invalid data format: Lean methods must be an array.');
      }

      await this.registerLeanMethods(leanMethodData);
    } catch (error) {
      console.error('Error fetching or registering lean methods:', error);
    }
  }

  async registerLeanMethods(leanMethodData) {
    for (const leanMethod of leanMethodData) {
      const leanMethodId = leanMethod.id;
      await this.registerLeanMethod(leanMethodId);
    }
  }

  async registerLeanMethod(leanMethodId) {
    if (this.leanMethods.has(leanMethodId)) {
      console.warn(`Lean method with ID '${leanMethodId}' already exists.`);
      return; // Avoid registering duplicates
    }

    try {
      const leanMethodClass = await import(`./${leanMethodId}.js`);
      this.leanMethods.set(leanMethodId, new leanMethodClass.default()); // Assuming default export
    } catch (error) {
      console.error(`Error importing or creating lean method '${leanMethodId}':`, error);
    }
  }


  getAllLeanMethods() {
    return this.leanMethods; // Convert Map values to an array
  }
  getLeanMethod(leanMethodId) {
    if (!this.leanMethods.has(leanMethodId)) {
      throw new Error(`Invalid leanMethodId: '${leanMethodId}' does not exist`);
    }
    return this.leanMethods.get(leanMethodId); // Return the class instance
  }
  
  enableLeanMethod(leanMethodId) {
    const leanMethod = this.getLeanMethod(leanMethodId);
    if (leanMethod) {
      leanMethod.isEnabled = true; // Assuming the lean method has an 'isEnabled' property
      console.log(`Lean method '${leanMethodId}' enabled.`);
    } else {
      console.warn(`Lean method with ID '${leanMethodId}' not found.`);
    }
  }
}

export { LeanMethodService };
