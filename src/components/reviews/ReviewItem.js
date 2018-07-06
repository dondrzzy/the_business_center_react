import React, { Component } from 'react';

export default class ReviewItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        <b>
          {this.props.review.user}
          {' '}
:
          {' '}
        </b>
        {this.props.review.text}
        <br />
        <p className="badge badge-danger">
          {this.props.review.created_at}
        </p>
        <span className="mini-border-bottom" />
      </li>
    );
  }
}
