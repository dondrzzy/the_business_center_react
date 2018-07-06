import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

export class BusinessStore extends EventEmitter{
    constructor(){
        super();
        this.businessWrap = {};
        this.message = null;
        this.reviews = {}
        this.reviewedBusinessId = null;
        this.currentBusinessId = null;
        this.updatedBusinesses = {}
        this.deletedBusinessId = ""
    }

    // return the message stored from the API
    getResponse = () => {
        return this.message;
    }

    // return the business wrap object
    getBusinesses = () => {
        return this.businessWrap;
    }

    // add business in response from API to the store
    loadBusinesses = res => {
        if(res.success){
            this.businessWrap = res;
            this.emit('change');
        }else{
            if(res.token === false){
                this.message = 'res.message';
                this.emit('redirect');
            }else{
                this.emit('failure');
            }
        }
    }

    // handle response from a register business action
    registerBusinesses = res => {
        if(res.success){
            this.message = res.message;
            this.emit('success');
        }else{
            if(res.token === false){
                this.message = "You must be logged in to perform that action"
                this.emit('redirect');
            }else{
                this.message = res.message;
                this.emit('failure');
            }
        }
    }

    // handle response from an update business action
    updateBusinesses = data => {
        if(data.res.success){
            this.message = data.res.message;
            this.updatedBusinesses = data.res.business;
            this.emit('update');
        }else{
            if(data.res.token === false){
                this.message = "You must be logged in to perform that action"
                this.emit('redirect');
            }else{
                this.message = data.res.message;
                this.emit('failure')
            }
        }
    }

    // handle delete business response from the server
    deleteBusiness = data => {
        if(data.res.success){
            this.message = data.res.message;
            this.deletedBusinessId = data.id;
            this.emit('delete');
        }else{
            if(data.res.token === false){
                this.message = "You must be logged in to perform that action"
                this.emit('redirect');
            }else{
                this.message = data.res.message;
                this.emit('failure')
            }
        }
    }

    getUpdatedBusiness = () => {
        let business = this.updatedBusinesses;
        // this.updatedBusinesses = {};
        return business
    }

    getDeletedBusiness = () => {
        return this.deletedBusinessId;
    }

    addReview = data => {
        if(data.res.success){
            this.reviewedBusinessId = data.id;
            this.message = data.res.message;
            this.emit('review_posted');
        }else{
            if(data.res.token === false){
                this.message = "You must be logged in to perform that action";
                this.emit('redirect');
            }
            else{
                this.message = data.res.message;
                this.emit('failure');
            }
        }
    }

    // takes in id and returns the reviews of that business
    getReviews = id => {
        return this.reviews[id];
    }

    // get the id of the business that just had an action perfomed
    getCurrentId = id => {
        if(id == this.currentBusinessId){
            this.currentBusinessId = null;
            return true;
        }
        return false;
    }

    // add response reviews to the store reviews object
    loadReviews = data => {
        if(data.res.success){
            this.reviews[data.id] = data.res.reviews ? data.res.reviews : [];
            this.currentBusinessId = data.id;
            this.emit('reviews_change')
        }
    }

    // confirm if the id of a business is equal to the business id currently stored in the store
    isReviewedBusiness = id => {
        if(id == this.reviewedBusinessId){
            this.reviewedBusinessId = null;
            return true;
        }
        return false;
    }

    handleActions = action => {
        switch (action.type) {
            case "LOAD_BUSINESSES":
                this.loadBusinesses(action.data);
                break;
            case "REGISTER_BUSINESSES":
                this.registerBusinesses(action.data);
                break;
                case "UPDATE_BUSINESSES":
                this.updateBusinesses(action.data);
                break;
            case "DELETE_BUSINESSES":
                this.deleteBusiness(action.data);
                break;
            case "GET_REVIEWS":
                this.loadReviews(action.data);
                break;
            case "ADD_REVIEW":
                this.addReview(action.data);
                break;
        }
    }
}

const businessStore = new BusinessStore;
dispatcher.register(businessStore.handleActions.bind(businessStore));
export default businessStore;
