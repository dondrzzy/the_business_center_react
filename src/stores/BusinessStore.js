import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

export class BusinessStore extends EventEmitter{
    constructor(){
        super();
        this.businessWrap = {};
        this.message = null;
        this.reviews = {
            
        }
        this.reviewedBusinessId = null;
        this.currentBusinessId = null;
    }

    getResponse(){
        return this.message;
    }

    getBusinesses(){
        return this.businessWrap;
    }

    loadBusinesses(res){
        console.log(res);
        if(res.success){
            this.businessWrap = res;
            this.emit('change');
        }else{
            if(res.token === false){
                this.emit('redirect');
            }else{
                this.emit('failure');
            }
        }
    }

    registerBusinesses(res){
        console.log(res)
        if(res.success){
            this.message = res.message;
            this.emit('success');
        }else{
            if(res.token === false){
                this.emit('redirect');
            }else{
                this.emit('failure');
            }
        }
    }
    addReview(data){
        console.log(data)
        if(data.res.success){
            this.reviewedBusinessId = data.id;
            this.message = data.res.message;
            this.emit('review_posted');
        }else{
            if(!data.res.token){
                this.reviewedBusinessId = data.id
                this.emit('login_required');
            }
            else{
                this.message = data.res.success
                this.emit('failure');
            }
        }
    }
    getReviews(id){
        return this.reviews[id];
    }
    getCurrentId(id){
        if(id == this.currentBusinessId){
            this.currentBusinessId = null;
            return true;
        }
        return false;
    }
    loadReviews(data){
        if(data.res.success){
            this.reviews[data.id] = data.res.reviews;
            this.currentBusinessId = data.id;
            this.emit('reviews_change')
        }
    }
    isReviewedBusiness(id){
        if(id == this.reviewedBusinessId){
            console.log('returning true');
            this.reviewedBusinessId = null;
            return true;
        }
        return false;
    }

    handleActions(action){
        switch (action.type) {
            case "LOAD_BUSINESSES":
                this.loadBusinesses(action.data);
                break;
            case "REGISTER_BUSINESSES":
                this.registerBusinesses(action.data);
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
