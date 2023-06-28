import React from "react";
import logo from "./logo.png";
import "./App.css";
import WorldClock from "./WolrdClock";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      place: "",
      places: ["Asia/Hong_Kong", "America/Los_Angeles"],
    };
  }

  addNewClock = (e) => {
    e.preventDefault();

    this.setState({
      places: this.state.places.concat(this.state.place),
      place: "",
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <div>
          <form onSubmit={(e) => this.addNewClock(e)}>
            <label>Insert a new place EG: Europe/London</label>
            <input
              type="text"
              value={this.state.place}
              placeholder="Europe/London"
              onChange={(e) =>
                this.setState({
                  place: e.target.value,
                })
              }
            />
            <input type="submit" value="submit" />
          </form>
        </div>
        <WorldClock clocks={this.state.places} />
      </div>
    );
  }
}

export default App;
