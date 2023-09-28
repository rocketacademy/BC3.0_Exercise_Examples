export default function EditComment(props) {
  console.log(props);
  return (
    <div>
      <label>Edit comment</label>
      <textarea
        rows={4}
        cols={40}
        type="text"
        value={props.editingComment.content}
        onChange={(e) =>
          props.setEditingComment((prevState) => ({
            ...prevState,
            content: e.target.value,
          }))
        }
      />
      <button onClick={() => props.editComment(props.editingComment)}>
        Edit
      </button>
    </div>
  );
}
