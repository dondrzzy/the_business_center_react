import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as BusinessActions from '../../actions/BusinessActions';
import BusinessStore from '../../stores/BusinessStore';
import $ from 'jquery';
import Gifs from '../../utils/gitImage';

export default class UpdateBusiness extends Component{
    constructor(props){
        super(props);
        this.state = {
            open: false,
            name: this.props.business.name,
            location: this.props.business.location,
            category: this.props.business.category.id,
            modalId: "updateBusiness"+this.props.business.id,
            dataTarget: "#updateBusiness"+this.props.business.id,
            defaultCategory: "" + this.props.business.category.id,
            formValidated : "",
            processing : false,
            loaderStyle : {display:"none"},
            nameClass : "form-control",
            validName : false,
            nameMessage:"This field is required",
            categoryClass : "form-control",
            validCategory : false,
            categoryMessage:"This field is required",
            locationClass : "form-control",
            validateLocation : false,
            locationMessage:"This field is required",
        }
    };

    showErrors = () => {
        this.setState({
            processing: false,
            loaderStyle: {display:"none"}
        });
    };

    // hide modal view on succesfully updating a business
    showUpdate = () => {
        this.setState({
            processing: false,
            loaderStyle: {display:"none"}
        })
        $(this.state.dataTarget).hide();
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open')
        // toast for only the matching business
        if(BusinessStore.getUpdatedBusiness().id === this.props.business.id)
            $(this.state.dataTarget).siblings('button').click()
    }

    componentWillMount = () => {
        BusinessStore.on('failure', () => this.showErrors() )
        BusinessStore.on('update', () => this.showUpdate() )
    }

    componentWillUnmount = () => {
        BusinessStore.removeListener('failure', () => {})
        BusinessStore.removeListener('update', () => {})
    }
    
    handleNameChange = event => {
        this.setState({
            name: event.target.value
        });
    }

    handleLocationChange = event =>
        this.setState({
            location: event.target.value
        });

    handleCategoryChange = event =>{
        this.setState({
            category: event.target.value
        });
    }

    handleNameValidation = name => {
        if(!name.trim()){
            this.setState({
                nameClass:"form-control is-invalid",
                validName : false
            });
        }else if(!this.validateName(name)){
            this.setState({
                nameClass:"form-control is-invalid",
                validName : false,
                nameMessage: "Please enter a valid business name"
            });
        }else{
            this.setState({
                nameClass:"form-control is-valid",
                validName : true
            });
            return true;
        }
        return false;
    }

    validateName = name => {
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        if (regex.test(name)) {
            return true;
        }else {
            return false;
        }
    }

    handleCategoryValidation = cat => {
        if(cat === ""){
            this.setState({
                categoryClass:"form-control is-invalid",
                validCategory : false
            });
        }else if(!this.validateCategory(cat)){
            this.setState({
                categoryClass:"form-control is-invalid",
                validCategory : false,
                categoryMessage: "Please select a valid business category"
            });
        }else{
            this.setState({
                categoryClass:"form-control is-valid",
                validCategory : true
            });
            return true;
        }
        return false;
    }

    validateCategory = category => {
        // eslint-disable-next-line to the line before.
        if (!isNaN(category)) {
            return true;
        }else {
            return false;
        }
    }

    handleLocationValidation = location => {
        if(!location.trim()){
            this.setState({
                locationClass:"form-control is-invalid",
                validLocation : false
            });
        }else if(!this.validateLocation(location)){
            this.setState({
                locationClass:"form-control is-invalid",
                validLocation : false,
                locationMessage: "Please enter a valid business location"
            });
        }else{
            this.setState({
                locationClass:"form-control is-valid",
                validLocation : true
            });
            return true;
        }
        return false;
    }

    validateLocation = location => {
        // eslint-disable-next-line to the line before.
        const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        if (regex.test(location)) {
            return true;
        }else {
            return false;
        }
    }

    handleSubmit = () => {
        let nameRes = this.handleNameValidation(this.state.name);
        let categoryRes = this.handleCategoryValidation(this.state.category);
        let locationRes = this.handleLocationValidation(this.state.location);
        this.setState({formValidated : "wasValidated"});
        if( nameRes && categoryRes && locationRes ){
            this.setState({loaderStyle:{display:"inline-block"}, processing:true});
            const data = {
                "name": this.state.name,
                "category": this.state.category,
                "location": this.state.location
            }
            BusinessActions.updateBusiness(data, this.props.business.id);
        }
    }

    render(){
        // create form error fields
        const { open } = this.state;
        let validField = <div className="feedback valid-feedback">Looks good</div>
        let validName = validField
        let invalidName = <div className="feedback invalid-feedback">{this.state.nameMessage}</div>
        let nameFeedback = this.state.validName ? validName : invalidName;
        let validCategory = validField
        let invalidCategory = <div className="feedback invalid-feedback">{this.state.categoryMessage}</div>
        let categoryFeedback = this.state.validCategory ? validCategory : invalidCategory;
        let validLocation = validField
        let invalidLocation = <div className="feedback invalid-feedback">{this.state.locationMessage}</div>
        let locationFeedback = this.state.validLocation ? validLocation : invalidLocation;
        let disabled = this.state.processing ? true : false;
        return(
            <div className="modal fade" id={this.state.modalId} tabIndex="-1" role="dialog" aria-labelledby="updateBusinessLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateBusinessLabel">Update Business</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form
                                disabled={disabled} className={this.state.formValidated} noValidate>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="name">Business Name:</label>
                                    <input
                                        disabled={disabled}
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={this.state.name}
                                        onChange={this.handleNameChange} />
                                    {nameFeedback}
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="location">Location:</label>
                                    <input
                                        disabled={disabled}
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        value={this.state.location}
                                        onChange={this.handleLocationChange} />
                                    {locationFeedback}
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="cat">Category:</label>
                                    <select
                                        name="cat"
                                        defaultValue={this.state.defaultCategory}
                                        onChange={this.handleCategoryChange}
                                        className="form-control" id="cat">
                                        {this.props.categoryOptions}
                                    </select>
                                    {categoryFeedback}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <img
                                style={this.state.loaderStyle}
                                // eslint-disable-next-line to the line before.
                                src={Gifs.getImageLoader()} />
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
