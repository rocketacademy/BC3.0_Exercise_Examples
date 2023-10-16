export default function SightingCard(props) {
  return (
    // Depending choose class name full dependent on prop passed
    <div className={props.full ? "full" : null}>
      {props.sighting && (
        <div>
          <h2>{props.sighting.country}</h2>
          <h3>{props.sighting.city}</h3>
          <h4>{props.sighting.locationDescription}</h4>
          <p>Date: {new Date(`${props.sighting.date}`).toLocaleDateString()}</p>
          {/* If the prop is full then showcase the full information, the note. */}
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
