import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReviewItem from '../reviews/ReviewItem';
import ReviewsList from '../reviews/ReviewsList';
import BusinessStore from '../../stores/BusinessStore';
import UserStore from '../../stores/UserStore';
import * as BusinessActions from '../../actions/BusinessActions';
import UpdateBusiness from './UpdateBusiness';
import DeleteBusiness from './DeleteBusiness';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';

export default class BusinessItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            reviewValue : '',
            reviewMessage:"This field is required",
            reviewClassName : "form-control",
            formMounted : false,
            login_required:false,
            reviews:[],
            dataTarget: "#updateBusiness"+this.props.business.id,
            isLoggedIn: UserStore.isLoggedIn()
        }
    }

    componentWillMount(){
        BusinessStore.on('review_posted', this.updateBusinessReviews);
        BusinessStore.on('reviews_change', this.getReviews);
    }

    componentDidMount(){
        BusinessActions.getReviews(this.props.business.id);
    }

    componentWillUnmount(){
        BusinessStore.removeListener('review_posted', this.updateBusinessReviews);
        BusinessStore.removeListener('reviews_change', this.getReviews);
    }

    // show form when user clicks post review
    showPostForm = () => {
        this.setState({formMounted:true});
    }

    // hide form on cancel event
    hidePostForm = () => {
        this.setState({formMounted:false});
    }

    // fetch business reviews on mounting the business
    getReviews = () => {
        if(BusinessStore.getCurrentId(this.props.business.id)){
            this.setState({reviews:BusinessStore.getReviews(this.props.business.id)});
        }
    }

    // update the business reviews on successfully posting a review
    updateBusinessReviews = () => {
        if(BusinessStore.isReviewedBusiness(this.props.business.id)){
            BusinessActions.getReviews(this.props.business.id); 
            this.setState({formMounted : false,})
            console.log('---', this.state)
        }        
    }

    postReview = event => {
        let review = this.state.reviewValue;
        let reviewRes = this.handleReviewValidation(review);
        if(reviewRes){
            let data = {
                'text': review
            }
            BusinessActions.postReview(this.props.business.id, data);
        }        
    }

    handleReviewValidation = review => {
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

    validateReview = review => {
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{3,100}$/);
        if (regex.test(review)) {
            return true;
        }else {
            return false;
        }
    }

    handleChangeReview = event => {
        this.setState({reviewValue: event.target.value});
    }

    render = () => {
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

        let reviewList;
        if(this.state.reviews.length > 0){
            reviewList = <ReviewsList
                postId={postId}
                reviews={this.state.reviews}
            />
        }

        // Append a post review form on button click
        let postForm;
        postForm = this.state.formMounted
        ?<div className="form-group">
            <textarea 
                ref='review' value={this.state.reviewValue} onChange={this.handleChangeReview}
                className={this.state.reviewClassName}
            ></textarea>
            {reviewFeedback}
            <button id="postBtn" onClick={this.postReview} className='btn btn-sm btn-primary'>Post</button>
            <button id="cancelBtn" className="btn btn-link" onClick={this.hidePostForm}>cancel</button>
        </div>
        : "";
        return(
            <div>
                <li className="u-b">
                    <div className={jumboClass}>
                        <h4> <Link to={link}>{this.props.business.name}</Link> | <span>{this.props.business.category.category}</span> 
                        { this.state.isLoggedIn === true &&
                            this.props.uid === this.props.business.user.id &&
                            this.props.viewOptions() &&
                            <div className="dropdown dropleft float-right">
                            <button className="btn btn-secondary" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-cog float-right"></i>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" data-toggle="modal" data-target={this.state.dataTarget} href="#">
                                    <span className="mr1">Update Business</span>
                                    <i className="fas fa-edit"></i>
                                </a>
                                <DeleteBusiness business={this.props.business}/>
                            </div>
                        </div>
                        }
                        </h4>
                        
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eaque aspernatur fugiat dolorum harum, similique sint sunt impedit, itaque voluptatum eos eius ipsa tempora nisi delectus distinctio voluptates? Harum, tenetur.</p>
                        <button data-toggle="collapse" className="review-btn btn btn btn-primary btn-sm" data-target={dataTarget} type="button"aria-expanded="false" aria-controls="reviews1">
                            Reviews <i className="fas fa-comment"></i>
                        </button>
                        {this.state.isLoggedIn === true &&
                            this.props.uid !== this.props.business.user.id &&
                            <button type="button"
                                    className="lc btn btn-sm btn-outline-warning" 
                                    onClick={this.showPostForm}
                            >Post Review</button>
                        }
                        <UpdateBusiness business={this.props.business} categoryOptions={this.props.categoryOptions}/>
                        {postForm}
                        {reviewList}
                    </div>
                </li>
                {this.props.bg && <hr/>}
            </div>

        )
    }
}
