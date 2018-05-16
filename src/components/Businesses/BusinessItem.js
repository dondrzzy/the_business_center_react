import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReviewItem from '../Reviews/ReviewItem';
import BusinessStore from '../../stores/BusinessStore';
import * as BusinessActions from '../../actions/BusinessActions';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';

export default class BusinessItem extends Component{
    constructor(){
        super();
        this.state = {
            reviewMessage:"This field is required",
            reviewClassName : "form-control",
            formMounted : false,
            login_required:false,
            reviews:[]
        }
        this.requestLogin = this.requestLogin.bind(this);
        this.getReviews =  this.getReviews.bind(this);
        this.updateBusinessReviews =this.updateBusinessReviews.bind(this);
    }
    componentWillMount(){
        BusinessStore.on('review_posted', this.updateBusinessReviews);
        BusinessStore.on('login_required', this.requestLogin);
        BusinessStore.on('reviews_change', this.getReviews);
    }
    componentDidMount(){
        BusinessActions.getReviews(this.props.business.id);
    }
    componentWillUnmount(){
        BusinessStore.removeListener('review_posted', this.updateBusinessReviews);
        BusinessStore.removeListener('login_required', this.requestLogin);
        BusinessStore.on('reviews_change', this.getReviews);
    }
    showPostForm(){
        this.setState({formMounted:true});
    }
    hidePostForm(){
        this.setState({formMounted:false});
    }
    getReviews(){
        if(BusinessStore.getCurrentId(this.props.business.id)){
            this.setState({reviews:BusinessStore.getReviews(this.props.business.id)});
        }
    }
    updateBusinessReviews(){
        if(BusinessStore.isReviewedBusiness(this.props.business.id)){
            BusinessActions.getReviews(this.props.business.id); 
            toast.success(BusinessStore.getResponse(), {
                position: toast.POSITION.TOP_RIGHT
            });
            this.setState({formMounted : false,})
        }        
    }
    requestLogin(){
        if(BusinessStore.isReviewedBusiness(this.props.business.id)){
            toast.error('You must be logged in to perform that action!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        
    }
    postReview = (e) => {
        e.preventDefault();
        
        let review = this.refs.review.value;
        let reviewRes = this.handleReviewValidation(review);
        if(reviewRes){
            let data = {
                'text': review
            }
            BusinessActions.postReview(this.props.business.id, data);
        }        
    }
    handleReviewValidation(review){
        if(!review.trim()){
            this.setState({
                reviewClassName:"form-control is-invalid",
                validReview : false
            });
        }else if(!this.validateReview(review)){
            this.setState({
                reviewClassName:"form-control is-invalid",
                validReview : false,
                reviewMessage: "Please enter a valid review"
            });
        }else{
            this.setState({
                reviewClassName:"form-control is-valid",
                validReview : true
            });
            return true;
        }
        return false;
    }
    validateReview(review){
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{3,100}$/);
        if (regex.test(review)) {
            return true;
        }else {
            return false;
        }
    }
    render(){
        console.log(this.state.reviews);
        let validReview = <div className="feedback valid-feedback">Looks good</div>
        let invalidReview = <div className="feedback invalid-feedback">{this.state.reviewMessage}</div>
        let reviewFeedback = this.state.validReview ? validReview : invalidReview;

        let jumboClass = "business-card jumbotron";
        if(this.props.bg){
            jumboClass = "business-card jumbotron light";
        }
        const link = "/businesses/"+this.props.business.id;
        const postId = "reviews"+this.props.business.id;
        const dataTarget = "#"+postId;

        let Reviews;
        if(this.state.reviews){
            Reviews =  this.state.reviews.map(review =>{
                return (<ReviewItem key={review.id} review={review} />)
            })
        }

        let postForm;
        postForm = this.state.formMounted
            ?<div className="form-group">
                <textarea ref='review' className={this.state.reviewClassName}></textarea>
                {reviewFeedback}
                <button onClick={this.postReview} className='btn btn-sm btn-primary'>Post</button>
                <button className="btn btn-link" onClick={this.hidePostForm.bind(this)}>cancel</button>
			</div>
            : "";
        return(
            <li className="my-b">
                <ToastContainer />
                <div className={jumboClass}>
                    <h4> <Link to={link}>{this.props.business.name}</Link> | <span>{this.props.business.category}</span> </h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eaque aspernatur fugiat dolorum harum, similique sint sunt impedit, itaque voluptatum eos eius ipsa tempora nisi delectus distinctio voluptates? Harum, tenetur.</p>
                    <button data-toggle="collapse" className="btn btn btn-primary btn-sm" data-target={dataTarget} type="button"aria-expanded="false" aria-controls="reviews1">
                        Reviews <i className="fas fa-comment"></i>
                    </button>
                    <button type="button" className="lc btn btn-sm btn-outline-warning" onClick={this.showPostForm.bind(this)}>Post Review</button>
                    {postForm}
                    <ul id={postId} className="reviews collapse">
                        {Reviews}
                    </ul>
                </div>
            </li>
        )
    }
}
