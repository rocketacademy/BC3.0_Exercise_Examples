import React from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";

class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
    };
  }
  tick = () => {
    this.setState({ date: new Date() });
  };
  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    return (
      <div className="App">
        <Container style={{ width: "50%" }}>
          <Row>
            <Col>
              {" "}
              <p>{this.props.timeZone}</p>
            </Col>
            <Col>
              {" "}
              <p>
                {this.state.date.toLocaleString("en-GB", {
                  timeZone: this.props.timeZone,
                })}
              </p>
            </Col>
          </Row>
        </Container>
        <p></p>
      </div>
    );
  }
}

export default Clock;
