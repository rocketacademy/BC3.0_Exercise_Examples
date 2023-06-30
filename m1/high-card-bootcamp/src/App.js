import React from "react";
import "./App.css";
import { makeShuffledDeck } from "./utils.js";
import CardComponent from "./Components/Card";

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
    // this.state.cardDeck.pop() modifies this.state.cardDeck array
    if (this.state.cardDeck.length > 0) {
      const newCurrCards = [
        this.state.cardDeck.pop(),
        this.state.cardDeck.pop(),
      ];
      this.setState(
        {
          currCards: newCurrCards,
        },
        () => {
          this.winner();
        }
      );
    }
  };

  winner = () => {
    if (this.state.currCards[0].rank > this.state.currCards[1].rank) {
      this.setState({ player1Score: this.state.player1Score + 1 });
    } else {
      this.setState({ player2Score: this.state.player2Score + 1 });
    }
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
      <div key={`${name}-${suit}`}>
        <CardComponent name={name} suit={suit} player={index} />
      </div>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <h3>High Card 🚀</h3>
          <h4>Overall Victories:</h4>
          <h3>
            Player 1: {this.state.winRecord.player1} -- Player 2:
            {this.state.winRecord.player2}
          </h3>
          <div className="cardContainer">{currCardElems}</div>
          <h3>Cards left: {this.state.cardDeck.length}</h3>
          <h3>Current Score</h3>
          <p>
            Player 1 Score: {this.state.player1Score} -- Player 2 Score:
            {this.state.player2Score}
          </p>
          {this.state.cardDeck.length > 0 ? (
            <button onClick={this.dealCards}>Deal</button>
          ) : (
            <p>Game over</p>
          )}
          <button onClick={this.restart}>Restart</button>
        </header>
      </div>
    );
  }
}

export default App;
