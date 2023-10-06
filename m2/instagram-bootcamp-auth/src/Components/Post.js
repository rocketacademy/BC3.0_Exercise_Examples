import React from "react";
import thumb from "../Images/thumb.png";
import { update } from "firebase/database";

export default class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
    };
  }

  // Like the current post by the currrent user
  likeCurrentPost = (e, post) => {
    const userId = this.props.user.uid;
    // get the item within firebase that we need to update
    const itemToUpdate = this.props.databaseRef(
      this.props.database,
      this.props.DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
    // check to see if the user has liked or not, add the truthy value for this user or toggle the value
    if (!post.val.likes) {
      updates["likes"] = {
        ...post.val.likes,
        [`${userId}`]: true,
      };
    } else {
      updates["likes"] = {
        ...post.val.likes,
        [`${userId}`]: !post.val.likes[`${userId}`],
      };
    }
    return update(itemToUpdate, updates);
  };

  // Allow users to add comments
  handleAddComment = (e, post) => {
    // get the item within firebase that we need to update
    const itemToUpdate = this.props.databaseRef(
      this.props.database,
      this.props.DB_MESSAGES_KEY + "/" + post.key
    );
    const email = this.props.user.email;
    const updates = {};
    // if the post already has comments include these comments into the array and add the new comment else add this comment to the empty comments array
    if (post.val.comments) {
      updates["comments"] = [
        ...post.val.comments,
        { comment: this.state.comment, date: `${new Date()}`, author: email },
      ];
    } else {
      updates["comments"] = [
        { comment: this.state.comment, date: `${new Date()}`, author: email },
      ];
    }

    this.setState({ comment: "" });
    return update(itemToUpdate, updates);
  };

  // helper function to handle the inputs
  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    // display all messages given as props
    let messageListItems = this.props.messages.map((message) => (
      <li key={message.key}>
        <h3>
          {message.val.title} - {message.val.poster}
        </h3>
        {/* If the message has an image display the image */}
        {message.val.url ? (
          <img src={message.val.url} alt={message.val.title} />
        ) : null}
        <p>{message.val.message}</p>
        <p>{message.val.date}</p>
        <div className="likes">
          <div>
            {/* Display the total number of likes */}
            {message.val.likes
              ? Object.values(message.val.likes).filter(
                  (item) => item !== false
                ).length
              : null}
          </div>
          {/* If the user is logged in allow them to like the post by adding a button */}
          {this.props.isLoggedIn ? (
            <button>
              <img
                className="like"
                src={thumb}
                alt="like"
                onClick={(e) => this.likeCurrentPost(e, message)}
              />
            </button>
          ) : null}
        </div>
        <label>Comments:</label> <br />
        {/* If the user is logged in allow them to add comments  */}
        {this.props.isLoggedIn ? (
          <>
            <input
              type="text"
              value={this.state.comment}
              onChange={this.handleChange}
              name="comment"
              placeholder="Add Comment"
            />
            <br />
            <button onClick={(e) => this.handleAddComment(e, message)}>
              Add Comment
            </button>
          </>
        ) : null}
        <ol>
          {/* display all of the comments for this post */}
          {message.val.comments && message.val.comments.length > 0 ? (
            message.val.comments.map((comment, i) => (
              <li key={i}>
                {comment.comment} - {comment.date} - {comment.author}
              </li>
            ))
          ) : (
            <p>No Comments</p>
          )}
        </ol>
      </li>
    ));
    return (
      <div>
        <ol>{messageListItems}</ol>
      </div>
    );
  }
}
