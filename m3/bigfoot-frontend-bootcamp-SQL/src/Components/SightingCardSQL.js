export default function SightingCard(props) {
  console.log(props);
  return (
    <div className={props.full ? "full" : null}>
      {props.sighting && (
        <div>
          <h4>{props.sighting.location}</h4>
          <p>Date: {new Date(`${props.sighting.date}`).toLocaleDateString()}</p>
          {props.full ? (
            <div>
              <p>{props.sighting.notes}</p>
            </div>
          ) : null}
          <h4>Comments:</h4>
          {props.sighting.comments && props.sighting.comments.length > 0 ? (
            props.sighting.comments.map((item) => (
              <>
                <p key={item.id}>{item.content}</p>
              </>
            ))
          ) : (
            <p>No comments</p>
          )}
        </div>
      )}
    </div>
  );
}
