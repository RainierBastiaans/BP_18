class LeanMethod {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isEnabled = false;
  }

  enable(){
    this.isEnabled = true;
  }
}

export { LeanMethod };
