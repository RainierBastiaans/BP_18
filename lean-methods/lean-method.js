class LeanMethod {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.isEnabled = false;
  }

  enable(){
    this.isEnabled = true;
  }
}

export { LeanMethod };
