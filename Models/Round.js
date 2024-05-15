class Round {
  constructor() {
    this.time = 180; // Time in seconds
    this.rounds = 5;
    this.currentRound = 0;
    this.completed = false;
  }

  start(){
    console.log("start round")
    setTimeout(this.end, 5000)
  }

  end(){
    console.log("end round")
    //alert("round over!")
    this.completed = true;
  }

}
export { Round }