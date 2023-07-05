import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default class Graph extends React.Component {
  render() {
    return (
      <div style={{ width: "95vw", height: "30vh", margin: "auto" }}>
        <ResponsiveContainer>
          <LineChart data={this.props.data}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="low"
              stroke="#00bbf0"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="high" stroke="#fdb44b" />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
