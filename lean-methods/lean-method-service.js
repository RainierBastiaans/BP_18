import availableLeanmethods from "../db/leanmethods.json" with { type: "json" };

class LeanMethodService {
  constructor() {
    this.leanMethods = new Map(); // Initialize with a Map
    this.availableLeanmethods = availableLeanmethods.leanMethods;
  }

  async registerLeanMethods() {
    // Loop through available lean methods and register them
    for (const leanMethod of this.availableLeanmethods) {
      const leanMethodId = leanMethod.id;
      await this.registerLeanMethod(leanMethodId); // Call registerLeanMethod for each ID
    }
  }

  async registerLeanMethod(leanMethodId) {
    if (this.leanMethods.has(leanMethodId)) {
      console.warn(`Lean method with ID '${leanMethodId}' already exists.`);
    } else {
      try {
        const leanMethodClass = await import(`./${leanMethodId}.js`);
        this.leanMethods.set(leanMethodId, new leanMethodClass.default()); // Assuming default export for the class
      } catch (error) {
        console.error(`Error importing or creating lean method '${leanMethodId}':`, error);
      }
    }
  }


  getAllLeanMethods() {
    return Array.from(this.leanMethods.values()); // Convert Map values to an array
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
