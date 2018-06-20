import React, {Component} from 'react';
import BusinessItem from './BusinessItem';
import BusinessStore from '../../stores/BusinessStore';
import * as BusinessActions from '../../actions/BusinessActions';

export default class Businesses extends Component{
    constructor(props){
        super(props);
        this.state = {
            businessWrap : {
                businesses:[],
                next_page:'',
                prev_page:''
            },
            params : {
                page:1,
                limit:5,
                location:'',
                category:'',
                q:'',
            }
        }
        this.getBusinesses = this.getBusinesses.bind(this);
        this.handleLimitChange = this.handleLimitChange.bind(this);
    }
    componentWillMount() {
        BusinessStore.on('change', this.getBusinesses);
    }
    componentWillUnmount() {
        BusinessStore.removeListener('change', this.getBusinesses);
    }
    componentDidMount() {
        BusinessActions.getBusinesses();
    }
    setParams(params) {
        if(this.refs.businesses) this.setState({ params });
    }
    getBusinesses() {
        this.setState({
            businessWrap: BusinessStore.getBusinesses()
        });
    }
    encodeQueryData() {
        console.log('encoding query data')
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
            console.log('params', urlParams.join('&'))
            BusinessActions.getBusinesses("?" + urlParams.join('&'));
        }
    }
    handleSubmit(e) {
        console.log('handle submit');
         e.preventDefault();
        let q = this.refs.q.value;
        let category = this.refs.category.value;
        let location = this.refs.location.value;
        console.log(q)
        console.log(category)
        console.log(location)
        if(q || category || location)
            this.encodeQueryData();
    }
    handleLimitChange(event){
        let params = this.state.params;
        params['limit'] = parseInt(event.target.value);
        this.setParams(params);
        this.encodeQueryData();
    }
    handleSetPage(page){
        let params = this.state.params;
        params['page'] = page ? page : 1;
        this.setParams(params);
        this.encodeQueryData();
    }    
    handleChangeSearch(e) {
        let params = this.state.params;
        params['q'] = e.target.value.trim();
        this.setParams(params);
    }
    handleChangeCategory(e) {
        let params = this.state.params;
        params['category'] = e.target.value.trim();
        this.setParams(params);
    }
    handleChangeLocation(e) {
        let params = this.state.params;
        params['location'] = e.target.value.trim();
        this.setParams(params);
    }
    render(){
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
                                    <input type="text" name="q" value={this.state.params.q} onChange={this.handleChangeSearch.bind(this)} className="form-control" ref="q" placeholder="Search By Name" />
                                </div>
                                <div className="form-group col-md-3 mx-sm-3 mb-2">
                                    <label htmlFor="category" className="sr-only">Category</label>
                                    <input type="text" name="category" value={this.state.params.category} onChange={this.handleChangeCategory.bind(this)}  className="form-control" ref="category" placeholder="Category" />
                                </div>
                                <div className="form-group col-md-3 mx-sm-3 mb-2">
                                    <label htmlFor="location" className="sr-only">Location</label>
                                    <input type="text" name="location" value={this.state.params.location} onChange={this.handleChangeLocation.bind(this)} className="form-control" ref="location" placeholder="Location" />
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
                                    <select value={this.state.params.limit} name="limit" ref="limit" id="limit" onChange={this.handleLimitChange}>
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
