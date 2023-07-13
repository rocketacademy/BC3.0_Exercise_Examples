import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";

// import image function so that we can get all images from the images folder
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

// get all images from the image folder into the image array.
const images = importAll(require.context("./images", true, /\.(PNG|png)$/));

class App extends React.Component {
  constructor(props) {
    super(props);
    // set up initial state of the application
    this.state = {
      // use the utlity function to generate a randomw word
      currWord: getRandomWord(),
      guessedLetters: [],
      numberOfGuessesLeft: 10,
      guess: "",
      round: 0,
      wins: 0,
      roundFinished: false,
    };
  }

  componentDidMount() {
    // bind the enter key so that when users press enter it submits the letter.
    document.addEventListener("keydown", this.keyPressed);
  }

  // function to handle the key press
  keyPressed = (e) => {
    if (this.state.roundFinished === false) {
      if (e.key === "Enter" && this.state.numberOfGuessesLeft > 0) {
        this.handleSubmit(e);
      }
    }
  };

  // Either show - or the letter of the randomly generated word
  generateWordDisplay = () => {
    const wordDisplay = [];
    for (let letter of this.state.currWord) {
      // if they have guessed the letter, it should appear otherwise it will be '-'
      if (this.state.guessedLetters.includes(letter)) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    return wordDisplay.toString();
  };

  // validate if the user has won or not
  checkWin = () => {
    if (
      this.state.currWord
        .split("")
        .every((e) => this.state.guessedLetters.includes(e))
    ) {
      this.setState({
        wins: this.state.wins + 1,
        roundFinished: true,
        round: this.state.round + 1,
      });
    }
  };

  // submit the currently guessed letter
  handleSubmit = (e) => {
    if (this.state.guess.length > 0) {
      this.setState(
        {
          guessedLetters: this.state.guessedLetters.concat(this.state.guess[0]),
          numberOfGuessesLeft: this.state.numberOfGuessesLeft - 1,
          guess: "",
        },
        () => {
          // check to see if the user has lost or won
          this.checkWin();
          if (this.state.numberOfGuessesLeft === 0) {
            this.setState({
              round: this.state.round + 1,
            });
          }
        }
      );
    } else {
      alert("please insert some text into the input");
    }
  };

  // reset game function
  reset = () => {
    this.setState({
      currWord: getRandomWord(),
      guessedLetters: [],
      numberOfGuessesLeft: 10,
      guess: "",
      roundFinished: false,
    });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Guess The Word 🚀</h1>
          <div className="Container">
            <div className="Column">
              <h3>Word Display</h3>
              {this.generateWordDisplay()}
              <div className="Image Container">
                Guesses Left: {this.state.numberOfGuessesLeft}
                {/* Show a different image depending on the number of guesses left. */}
                <img
                  src={images[`hm${10 - this.state.numberOfGuessesLeft}.PNG`]}
                  alt=""
                />
              </div>
            </div>
            <div className="Column">
              <h3>Guessed Letters</h3>
              {this.state.guessedLetters.length > 0
                ? this.state.guessedLetters.toString()
                : "-"}
              <h3>Input</h3>
              <input
                type="text"
                value={this.state.guess}
                max="1"
                onChange={(e) =>
                  this.setState({ guess: e.target.value.toLowerCase() })
                }
              />

              {this.state.numberOfGuessesLeft === 0 ? (
                <div>
                  <h3>You have no lives left. Please restart</h3>
                  <h3>Correct word: {this.state.currWord}</h3>
                </div>
              ) : this.state.roundFinished ? (
                <h3>You have won. Please restart</h3>
              ) : (
                <button onClick={(e) => this.handleSubmit(e)}>submit</button>
              )}
              <button onClick={() => this.reset()}>Reset</button>
            </div>
          </div>

          <h3>
            Won: {this.state.wins} -- Round: {this.state.round}
          </h3>
        </header>
      </div>
    );
  }
}

export default App;
