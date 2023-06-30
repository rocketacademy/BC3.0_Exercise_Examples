import React from "react";
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
      <div>
        <Container fluid>
          <Row>
            <Col>
              <p>{this.props.timeZone}</p>
            </Col>
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
