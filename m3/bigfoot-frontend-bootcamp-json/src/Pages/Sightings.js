import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import SightingCard from "../Components/SightingCard";
function Sightings(props) {
  const [sightings, setSightings] = useState([]);
  const [filter, setFilter] = useState("");
  const [ascending, setAscending] = useState(false);
  const [sortByReportNumber, setSortByReportNumber] = useState(false);

  let [searchParams, setSearchParams] = useSearchParams();

  const getSightings = async (props) => {
    let data = await axios.get(
      `${process.env.REACT_APP_BACKEND_KEY}/sightings`
    );
    console.log(data.data);
    setSightings(data.data);
  };

  useEffect(() => {
    getSightings();
    console.log(searchParams);
  }, []);

  const copyOfSighting = [...sightings];

  const sorted = sortByReportNumber
    ? ascending
      ? copyOfSighting.sort((a, b) => a.REPORT_NUMBER - b.REPORT_NUMBER)
      : copyOfSighting.sort((a, b) => b.REPORT_NUMBER - a.REPORT_NUMBER)
    : sightings;

  const filtered = sorted.filter((sighting) =>
    filter ? sighting.YEAR === filter : sighting
  );

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setSortByReportNumber(!sortByReportNumber)}>
          Sort by Report Number
        </button>

        <button onClick={() => setAscending(!ascending)}>
          Acending/Decending
        </button>

        <label>Search Sightings:</label>
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setSearchParams(e.target.value);
          }}
          placeholder="Search by year"
        />
        <div className="flexCenter">
          {sightings && sightings.length > 0 ? (
            filtered.map((sighting, index) => {
              return (
                <div className="card" key={index}>
                  <SightingCard
                    sighting={sighting}
                    setEditSighting={props.setEditSighting}
                    searchParams={searchParams}
                  />
                  <Link to={`/sighting/${index}`}>More Details</Link>
                </div>
              );
            })
          ) : (
            <p>No data</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default Sightings;
