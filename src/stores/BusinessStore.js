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

    getResponse = () => {
        return this.message;
    }

    getBusinesses = () => {
        return this.businessWrap;
    }

    loadBusinesses = res => {
        console.log('res', res);
        if(res.success){
            this.businessWrap = res;
            this.emit('change');
        }else{
            if(res.token === false){
                console.log('emmiting redirect')
                this.emit('redirect');
            }else{
                this.emit('failure');
            }
        }
    }

    registerBusinesses = res => {
        if(res.success){
            this.message = res.message;
            this.emit('success');
        }else{
            if(res.token === false){
                this.message = "You must be logged in to perform that action."
                this.emit('redirect');
            }else{
                this.message = res.message;
                this.emit('failure');
            }
        }
    }

    updateBusinesses = data => {
        if(data.res.success){
            this.message = data.res.message;
            this.updatedBusinesses = data.res.business;
            this.emit('update');
        }else{
            if(data.res.token === false){
                this.message = "You must be logged in to perform that action."
                this.emit('redirect');
            }else{
                this.message = data.res.message;
                this.emit('failure')
            }
        }
    }
    deleteBusinesses = data => {
        if(data.res.success){
            this.message = data.res.message;
            this.deletedBusinessId = data.id;
            this.emit('delete');
        }else{
            if(data.res.token === false){
                this.message = "You must be logged in to perform that action."
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
            if(!data.res.token){
                this.message = "You must be logged in to perform that action."
                this.emit('redirect');
            }
            else{
                this.message = data.res.success
                this.emit('failure');
            }
        }
    }

    getReviews = id => {
        return this.reviews[id];
    }

    getCurrentId = id => {
        if(id == this.currentBusinessId){
            this.currentBusinessId = null;
            return true;
        }
        return false;
    }

    loadReviews = data => {
        if(data.res.success){
            this.reviews[data.id] = data.res.reviews;
            this.currentBusinessId = data.id;
            this.emit('reviews_change')
        }
    }

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
                this.deleteBusinesses(action.data);
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
