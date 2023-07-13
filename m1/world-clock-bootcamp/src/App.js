import React from "react";
import logo from "./logo.png";
import "./App.css";
import WorldClock from "./Components/WolrdClock";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // state to capture users input
      place: "",
      // state to contain the current clocks to display
      places: ["Asia/Hong_Kong", "America/Los_Angeles"],
    };
  }

  // method to add an additional place into state while resetting the input
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
          {/* Form to capture the users input place */}
          <div>
            <form onSubmit={(e) => this.addNewClock(e)}>
              <label>
                Insert a new place, Continent/City ~ eg: Europe/London
              </label>
              <br />
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
          {/* Display all of the places as clocks below */}
          <div>
            {/* Pass in the value of this.state.places as the clocks prop  */}
            <WorldClock clocks={this.state.places} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
