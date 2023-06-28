import React from "react";
import "./App.css";
import { makeShuffledDeck } from "./utils.js";

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      // Set default value of card deck to new shuffled deck
      cardDeck: makeShuffledDeck(),
      // currCards holds the cards from the current round
      currCards: [],
      player1Score: 0,
      player2Score: 0,
      winRecord: {
        player1: 0,
        player2: 0,
      },
    };
  }

  restart = () => {
    this.setState({
      cardDeck: makeShuffledDeck(),
      currCards: [],
      player1Score: 0,
      player2Score: 0,
    });
  };

  dealCards = () => {
    this.setState(
      (state) => ({
        // Remove last 2 cards from cardDeck
        cardDeck: state.cardDeck.slice(0, -2),
        // Deal last 2 cards to currCards
        currCards: state.cardDeck.slice(-2),
      }) //, // callback version of waiting for winner
      //() => this.winner()
    );

    // wait for state to update before checking your winner.
    setTimeout(() => {
      this.winner();
    }, 20);
  };

  winner = () => {
    // console.log(this.state.currCards);
    if (this.state.currCards[0].rank > this.state.currCards[1].rank) {
      this.setState({ player1Score: this.state.player1Score + 1 });
    } else {
      this.setState({ player2Score: this.state.player2Score + 1 });
    }
    // console.log(this.state.cardDeck.length);
    if (this.state.cardDeck.length === 0) {
      this.overallWinner();
    }
  };

  overallWinner = () => {
    if (this.state.player1Score > this.state.player2Score) {
      alert("Player 1 Wins");
      this.setState({
        winRecord: {
          player1: this.state.winRecord.player1 + 1,
          player2: this.state.winRecord.player2,
        },
      });
    } else {
      alert("Player 2 Wins ");
      this.setState({
        winRecord: {
          player1: this.state.winRecord.player1,
          player2: this.state.winRecord.player2 + 1,
        },
      });
    }
  };

  componentDidUpdate() {
    console.log("Current Cards: ", this.state.currCards);
    console.log("Current Deck: ", this.state.cardDeck);
  }

  render() {
    const currCardElems = this.state.currCards.map(({ name, suit }, index) => (
      // Give each list element a unique key
      <div key={`${name}${suit}`}>
        <p>Player: {index + 1}</p>
        {name} of {suit}
      </div>
    ));

    console.log(React);

    // console.log("render: ", this.state.currCards);

    return (
      <div className="App">
        <header className="App-header">
          <h3>High Card 🚀</h3>
          <h4>Overall Victories:</h4>
          <h5>
            Player 1: {this.state.winRecord.player1} -- Player 2:
            {this.state.winRecord.player2}
          </h5>
          {currCardElems}
          <br />
          <h3>Cards left: {this.state.cardDeck.length}</h3>
          <p>
            Player 1 Score: {this.state.player1Score} -- Player 2 Score:{" "}
            {this.state.player2Score}
          </p>

          <button onClick={this.dealCards}>Deal</button>
          <button onClick={this.restart}>Restart</button>
        </header>
      </div>
    );
  }
}

export default App;
