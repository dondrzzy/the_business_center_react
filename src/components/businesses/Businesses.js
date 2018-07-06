import React, {Component} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UserStore from '../../stores/UserStore';
import BusinessList from './BusinessList';
import BusinessStore from '../../stores/BusinessStore';
import * as BusinessActions from '../../actions/BusinessActions';

export default class Businesses extends Component{
    constructor(){
        super();
        this.state = {
            decodedId: '',
            businessWrap : {
                businesses:[],
                next_page:'',
                prev_page:'',
                categories: [],
                total: 0
            },
            params : {
                page:1,
                limit:5,
                location:'',
                category:'',
                q:'',
            },
            formValidated: 'form',
            invalidForm: false,
            formFeedback: "",
            message: ""
        }
    }
    componentWillMount = () => {
        this.setState({
            decodedId: UserStore.getDecodedId()
        });
        BusinessStore.on('change', this.getBusinesses);
        BusinessStore.on('review_posted', this.toastSuccess);
        BusinessStore.on('failure', this.toastErrors);
    }
    componentWillUnmount = () => {
        BusinessStore.removeListener('change', this.getBusinesses);
        BusinessStore.removeListener('review_posted', this.toastSuccess);
        BusinessStore.removeListener('failure', this.toastErrors);
    }
    componentDidMount = () => {
        BusinessActions.getBusinesses('');
    }
    toastErrors = () => {
        this.setState({
            message: BusinessStore.getResponse()
        })
        toast.error(BusinessStore.getResponse(), {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
        });
    }
    toastSuccess = () => {
        toast.success(BusinessStore.getResponse(), {
            position: toast.POSITION.TOP_RIGHT
        });
    }
    setParams = params => {
        if(this.refs.businesses) this.setState({ params });
    }
    getBusinesses = () => {
        this.setState({
            businessWrap: BusinessStore.getBusinesses()
        });
    }
    encodeQueryData = () => {
        let params = this.state.params;
        let urlParams = [];
        for (let i in params){
            if(params[i] !== '' ){
                if(i === 'page' && params[i] !== 1)
                    urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
                else if(i === 'limit' && params[i] !== 5)
                    urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
                else if(i === 'q'){
                    urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));}
                else if(i === 'category')
                    urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
                else if(i === 'location')
                    urlParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
            }
        }
        if(this.refs.businesses){
            BusinessActions.getBusinesses("?" + urlParams.join('&'));
        }
    }
    handleSubmit = event => {
        event.preventDefault();
        let q = this.state.params.q;
        let category = this.state.params.category;
        let location = this.state.params.location;
        if(q || category || location){
            this.setState({
                formValidated: 'form wasValidated',
                formFeedback: ''
            })
            this.encodeQueryData();
        }
        else
            this.setState({
                formValidated: 'form wasValidated',
                formFeedback: 'Please fill any of the form fields'
            })
    }
    handleLimitChange = event => {
        let params = this.state.params;
        params['limit'] = parseInt(event.target.value);
        this.setParams(params);
        this.encodeQueryData();
    }
    handleSetPage = page =>{
        let params = this.state.params;
        params['page'] = page ? page : 1;
        params['formValidated'] = 'form';
        this.setParams(params);
        this.encodeQueryData();
    }    
    handleChangeSearch = event => {
        let params = this.state.params;
        params['q'] = event.target.value.trim();
        this.setState({formValidated: 'form'});
        this.setParams(params);
    }
    handleChangeCategory = event => {
        let params = this.state.params;
        params['category'] = event.target.value.trim()
        ?event.target.value.trim()
        :'';
        this.setState({formValidated: 'form'});
        this.setParams(params);
    }
    handleChangeLocation = event => {
        let params = this.state.params;
        params['location'] = event.target.value.trim();
        this.setState({formValidated: 'form'});
        this.setParams(params);
    }
    viewOptionsButtons = () => {
        return false;
    }
    viewPostReviewButton = () => {
        return true;
    }
    render = () => {
        // create the pagination buttons depending on the response from the server
        let {prev_page} = this.state.businessWrap;
        let {next_page} = this.state.businessWrap;
        
        let prev = prev_page
        ? <li className="page-item"><a className="page-link" id="prev-link" onClick={ () => this.handleSetPage(prev_page)} href="#">Previous</a></li>
        : <li className="page-item disabled"><span className="page-link off">Previous</span></li>
    
        let next = next_page
        ? <li className="page-item"><a className="page-link" id="next-link" onClick={ () => this.handleSetPage(next_page)} href="#">Next</a></li>
        : <li className="page-item disabled"><span className="page-link off">Next</span></li>
        let curr = next_page ? next_page-1:prev_page+1;

        // create the category option elements for the select element
        let categoryOptions;
        if(this.state.businessWrap.categories)
            categoryOptions = this.state.businessWrap.categories.map(option => {
                return(<option key={option.id} value={option.id}>{option.category}</option>)
            });

        // pass the required props to the business list component
        let businessList = <BusinessList
            categoryOptions={categoryOptions}
            businesses={this.state.businessWrap.businesses}
            uid={this.state.decodedId}
            viewOptionsButtons={this.viewOptionsButtons}
        />

        return(
            <div className="container" id="main">
            <div ref="businesses" className="businesses">
                <div className="row">
                    <ToastContainer />
                    <div className="col">
                        <div className="call-action align-middle">
                            <form className={this.state.formValidated} onSubmit={this.handleSubmit}>
                                <div className="row no-margin-bottom">
                                    <div className="form-group col-md-3 mb-2">
                                        <label htmlFor="q" className="sr-only">Search</label>
                                        <input
                                            type="text"
                                            name="q"
                                            value={this.state.params.q}
                                            onChange={this.handleChangeSearch}
                                            className="form-control"
                                            placeholder="Search By Name"
                                        />
                                    </div>
                                    <div className="form-group col-md-3 mb-2">
                                        <label htmlFor="category" className="sr-only">Category</label>
                                        <select
                                            value={this.state.params.category}
                                            onChange={this.handleChangeCategory}
                                            name="category"
                                            id="category"
                                            placeholder="Category"
                                            className="form-control">
                                            <option value="">Select category</option>
                                            {categoryOptions}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-3 mb-2">
                                        <label htmlFor="location" className="sr-only">Location</label>
                                        <input type="text" name="location" value={this.state.params.location} onChange={this.handleChangeLocation} className="form-control" placeholder="Location" />
                                    </div>
                                    <div className="form-group col-md-3 mb-2">
                                        <button type="submit" className="btn btn-primary btn-block">Submit</button>
                                    </div>
                                    <div className="form-group col">
                                        <div className="feedback invalid-feedback">{this.state.formFeedback}</div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        
                        <h4 className="section-heading">
                            {this.state.businessWrap.businesses.length} Available Businesses
                            <span></span>
                        </h4>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                                <li className="page-item disabled"><span className="page-link">Per page:</span></li>
                                <li className="page-item">
                                    <select value={this.state.params.limit} name="limit" id="limit" onChange={this.handleLimitChange}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                    </select>
                                </li>
                                {prev}
                                <li className="page-item active"><span className="page-link">{curr}</span></li>
                                {next}
                            </ul>
                        </nav>
                        {businessList}
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
