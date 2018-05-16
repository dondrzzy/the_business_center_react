import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import BusinessItem from './BusinessItem';
import BusinessStore from '../../stores/BusinessStore';
import * as BusinessActions from '../../actions/BusinessActions';

export default class Businesses extends Component{
    constructor(){
        super();
        let query;
        this.urlParams = {
            page:1,
            limit:5,
            location:'',
            category:'',
            q:''
        }
        this.state = {
            businessWrap : {
                businesses:[],
                next_page:null,
                prev_page:null
            },
            page:1,
            limit:5,
            location:'',
            category:'',
            q:'',
            urlParams:''
        }
        this.getBusinesses = this.getBusinesses.bind(this);
        this.handleLimitChange = this.handleLimitChange.bind(this);
    }
    componentWillMount(){
        this.query = new URLSearchParams(this.props.location.search)
        this.urlParams.q = this.query.get('q') ? this.query.get('q') : this.urlParams.q;
        this.urlParams.limit = this.query.get('limit') ? this.query.get('limit') : this.urlParams.limit;
        this.urlParams.category = this.query.get('category') ? this.query.get('category') : this.urlParams.category;
        this.urlParams.location = this.query.get('location') ? this.query.get('location') : this.urlParams.location;
        this.urlParams.page = this.query.get('page') ? this.query.get('page') : this.urlParams.page;

        BusinessStore.on('change', this.getBusinesses);
        // BusinessActions.getBusinesses(this.props.location.search);
    }
    componentDidMount(){
        BusinessActions.getBusinesses(this.props.location.search);
    }
    getBusinesses(){
        if(this.refs.businesses)
            this.setState({
                businessWrap : BusinessStore.getBusinesses()
            });
    }
    handleSubmit(e){
        let q = this.refs.q.value;
        let category = this.refs.category.value;
        let location = this.refs.location.value;

        this.urlParams.q = q ? q : '';
        this.urlParams.category = category ? category : '';
        this.urlParams.location = location ? location : '';

        if(q || category || location)
            this.encodeQueryData();

        e.preventDefault();
    }
    handleLimitChange(event){
        this.urlParams.limit =  parseInt(event.target.value);
        this.encodeQueryData();
    }
    handleSetPage(page){
        let newPage = page ? page : 1;
        this.urlParams.page = newPage;
        this.encodeQueryData();
    }
    encodeQueryData(){
        let data = this.urlParams
        let ret = [];
        for (let d in data){
            if(data[d] !== 'null' && data[d] !== null && data[d] !== '' ){
                if(d === 'page' && data[d] !== 1)
                    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                else if(d === 'limit' && data[d] !== 5)
                    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                else if(d === 'q'){
                    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));}
                else if(d === 'category')
                    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                else if(d === 'location')
                    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
            }   
        }
        // console.log(ret.join('&'));
        if(this.refs.businesses){
            this.setState({urlParams:ret.join('&')})
            window.location.assign(this.props.location.pathname + "?" + ret.join('&'));
        }
    }
    handleChangeSearch(e){
        let value = e.target.value;
        this.urlParams.q = value.trim()
        if(this.refs.businesses)
            this.setState({
                q:e.target.value.trim()
            });
    }
    handleChangeCategory(e){
        let value = e.target.value
        this.urlParams.category = value.trim()
        if(this.refs.businesses)
            this.setState({
                category:value.trim()
            });
    }
    handleChangeLocation(e){
        let value = e.target.value;
        this.urlParams.location = value.trim()
        if(this.refs.businesses)
            this.setState({
                location:value.trim()
            });
    }
    render(){
        // console.log('params', this.urlParams);
        // console.log('state', this.state);
        let {prev_page} = this.state.businessWrap;
        let {next_page} = this.state.businessWrap;

        let prev = prev_page
        ? <li className="page-item"><a className="page-link" onClick={this.handleSetPage.bind(this, prev_page)} href="#">Previous</a></li>
        : <li className="page-item disabled"><span className="page-link">Previous</span></li>
    
        let next = next_page
        ? <li className="page-item"><a className="page-link" onClick={this.handleSetPage.bind(this, next_page)} href="#">Next</a></li>
        : <li className="page-item disabled"><span className="page-link">Next</span></li>
        let curr = next_page ? next_page-1:prev_page+1;

        let businessItems;
        let bgLight = true;
        if(this.state.businessWrap.businesses)
            businessItems =  this.state.businessWrap.businesses.map(business =>{
                let bg = bgLight;
                bgLight = !bgLight;
                return (<BusinessItem key={business.id} bg={bg} business={business} />)
            })

        return(
            <div ref="businesses" className="businesses">
                
                <div className="row">
                    <div className="col">
                        <div className="call-action">
                            <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
                                <div className="form-group col-md-3 mx-sm-3 mb-2">
                                    <label htmlFor="q" className="sr-only">Search</label>
                                    <input type="text" value={this.urlParams.q} onChange={this.handleChangeSearch.bind(this)} className="form-control" ref="q" placeholder="Search By Name" />
                                </div>
                                <div className="form-group col-md-3 mx-sm-3 mb-2">
                                    <label htmlFor="category" className="sr-only">Category</label>
                                    <input type="text" value={this.urlParams.category} onChange={this.handleChangeCategory.bind(this)}  className="form-control" ref="category" placeholder="Category" />
                                </div>
                                <div className="form-group col-md-3 mx-sm-3 mb-2">
                                    <label htmlFor="location" className="sr-only">Location</label>
                                    <input type="text" value={this.urlParams.location} onChange={this.handleChangeLocation.bind(this)} className="form-control" ref="location" placeholder="Location" />
                                </div>
                                <div className="form-group col-md-3 mx-sm-3 mb-2">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        
                        <h4 className="section-heading">
                            Our Businesses
                            <span></span>
                        </h4>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                                <li className="page-item disabled"><span className="page-link">Per page:</span></li>
                                <li className="page-item">
                                    <select value={this.urlParams.limit} ref="limit" id="limit" onChange={this.handleLimitChange}>
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
                        <ul className="my-bs">
                            {businessItems}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
