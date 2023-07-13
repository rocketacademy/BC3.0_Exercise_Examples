import Clock from "./Clock";
import React from "react";

export default class WorldClock extends React.Component {
  render() {
    return (
      <div className="text-white">
        {/* Conditional operator, if the places exsist then we map through each value and instansiate a clock component, passing in the zone as the timeZone prop. */}
        {this.props.clocks ? (
          this.props.clocks.map((zone, index) => (
            // Render the clock with the custom timezones
            <Clock key={index} timeZone={`${zone}`} />
          ))
        ) : (
          // If no timezones were given then we render out a clock with the Hong Kong timezone.
          <Clock timeZone="Asia/Hong_Kong" />
        )}
      </div>
    );
  }
}
