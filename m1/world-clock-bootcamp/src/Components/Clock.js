import React from "react";
import { Container, Row, Col } from "react-bootstrap";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    // Capture the current date and time upon component mountuing
    this.state = {
      date: new Date(),
    };
  }
  // Create a tick function that will update the date state
  tick = () => {
    this.setState({ date: new Date() });
  };
  // When the component mounts create an interval timer that runs this.tick every second, store it in this.timer.
  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }
  // When the component is removed from the browser clear the timer interval
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            {/* Show timezone */}
            <Col>
              <p>{this.props.timeZone}</p>
            </Col>
            {/* Display the current time in the local time string */}
            <Col>
              <p className="display">
                {this.state.date.toLocaleString("en-GB", {
                  timeZone: this.props.timeZone,
                })}
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Clock;
