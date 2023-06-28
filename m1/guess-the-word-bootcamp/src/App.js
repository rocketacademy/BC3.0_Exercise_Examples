import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all letters a user has guessed so far
      guessedLetters: [],
      // Insert num guesses left state here
      numberOfGuessesLeft: 10,
      guess: "",
      round: 0,
      wins: 0,
      // Insert form input state here
    };
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    // for...of is a string and array iterator that does not use index
    for (let letter of this.state.currWord) {
      if (this.state.guessedLetters.includes(letter)) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    return wordDisplay.toString();
  };

  checkWin = () => {
    if (
      this.state.currWord
        .split("")
        .every((e) => this.state.guessedLetters.includes(e))
    ) {
      alert("You win!!");
      this.setState({
        round: this.state.round + 1,
        wins: this.state.wins + 1,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.numberOfGuessesLeft < 1) {
      alert("You have lost");
      this.setState({
        guessedLetters: this.state.guessedLetters.concat(
          ...this.state.currWord
        ),
        round: this.state.round + 1,
      });
    } else if (this.state.guess.length > 0) {
      await this.setState({
        guessedLetters: this.state.guessedLetters.concat(this.state.guess[0]),
        numberOfGuessesLeft: this.state.numberOfGuessesLeft - 1,
        guess: "",
      });
      this.checkWin();
    } else {
      alert("please insert some text into the input");
    }
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Guess The Word 🚀</h1>
          <h3>
            Won: {this.state.wins} -- Round: {this.state.round}
          </h3>
          <h3>Word Display</h3>
          {this.generateWordDisplay()}
          <h3>Guesses left: {this.state.numberOfGuessesLeft}</h3>
          <h3>Guessed Letters</h3>
          {this.state.guessedLetters.length > 0
            ? this.state.guessedLetters.toString()
            : "-"}
          <h3>Input</h3>
          <form>
            <input
              type="text"
              value={this.state.guess}
              max="1"
              onChange={(e) => this.setState({ guess: e.target.value })}
            />{" "}
            <button onClick={(e) => this.handleSubmit(e)}>submit</button>
          </form>
          <button
            onClick={() =>
              this.setState({
                currWord: getRandomWord(),
                // guessedLetters stores all letters a user has guessed so far
                guessedLetters: [],
                // Insert num guesses left state here
                numberOfGuessesLeft: 10,
                guess: "",
              })
            }
          >
            Reset
          </button>
        </header>
      </div>
    );
  }
}

export default App;
