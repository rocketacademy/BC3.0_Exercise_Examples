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

  likeCurrentPost = (e, post) => {
    const userId = this.props.user.uid;
    const itemToUpdate = this.props.databaseRef(
      this.props.database,
      this.props.DB_MESSAGES_KEY + "/" + post.key
    );
    const updates = {};
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

  handleAddComment = (e, post) => {
    const itemToUpdate = this.props.databaseRef(
      this.props.database,
      this.props.DB_MESSAGES_KEY + "/" + post.key
    );
    const email = this.props.user.email;
    const updates = {};
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

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    let messageListItems = this.props.messages.map((message) => (
      <li key={message.key}>
        <h3>
          {message.val.title} - {message.val.poster}
        </h3>
        {message.val.url ? (
          <img src={message.val.url} alt={message.val.title} />
        ) : null}
        <p>{message.val.message}</p>
        <p>{message.val.date}</p>
        <div className="likes">
          <div>
            {message.val.likes
              ? Object.values(message.val.likes).filter(
                  (item) => item !== false
                ).length
              : null}
          </div>
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
