import React, { Component } from 'react';

export default class ReviewItem extends Component{
    render(){
        return (
            <li ><b>{this.props.review.user} : </b>{this.props.review.text}<span className="badge badge-danger">{Date.now()}</span> <span className="mini-border-bottom"></span></li>
        )
    }
} 