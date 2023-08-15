export default function SightingCard(props) {
  return (
    <div className={props.full ? "full" : null}>
      {props.sighting && (
        <div>
          <h4>
            {props.sighting.COUNTY}-{props.sighting.STATE}
          </h4>
          <p>Report Number:{props.sighting.REPORT_NUMBER}</p>
          <p>Report Class: {props.sighting.REPORT_CLASS}</p>
          <p>
            Year and Season: {props.sighting.YEAR} -{props.sighting.SEASON}
          </p>
          {props.full ? (
            <div>
              <p>{props.sighting.ENVIROMENT}</p>
              <p>{props.sighting.OBSERVED}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
