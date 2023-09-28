export default function SightingCard(props) {
  console.log(props);
  return (
    <div className={props.full ? "full" : null}>
      {props.sighting && (
        <div>
          <h2>{props.sighting.country}</h2>
          <h3>{props.sighting.city}</h3>
          <h4>{props.sighting.locationDescription}</h4>
          <p>Date: {new Date(`${props.sighting.date}`).toLocaleDateString()}</p>
          {props.full ? (
            <div>
              <p>{props.sighting.notes}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
