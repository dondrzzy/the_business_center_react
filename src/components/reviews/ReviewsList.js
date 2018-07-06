import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReviewItem from '../reviews/ReviewItem';

export default class ReviewsList extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){

        const postId = this.props.postId;

        let Reviews;
        if(this.props.reviews){
            Reviews =  this.props.reviews.map(review =>{
                return (<ReviewItem key={review.id} review={review} />)
            });
        }

        return(
            <div className="review-wrapper">
                <ul id={postId} className="reviews collapse">
                    {Reviews}
                </ul>
            </div>
            
        )
    }
}
