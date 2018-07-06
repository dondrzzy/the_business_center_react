import React, {Component} from 'react';
import BusinessItem from './BusinessItem';

export default class BusinessList extends Component{
    constructor(props){
        super(props);
    }
    // create a list of business items
    // takes in an array of businesses in props
    render(){

        let businessItems;
        let bgLight = true;
        if(this.props.businesses)
            businessItems =  this.props.businesses.map(business => {
                // toggle between backgrounds
                let bg = bgLight;
                bgLight = !bgLight;
                return (
                    <BusinessItem 
                    key={business.id}
                    bg={bg} business={business}
                    categoryOptions={this.props.categoryOptions}
                    uid={this.props.uid}
                    viewOptions={this.props.viewOptionsButtons} />
                )
            })

        return(
            <ul className="u-bs">
                { this.props.businesses.length > 0 && businessItems}
                {this.props.businesses.length == 0 &&
                    <li className="u-b">
                        No business found
                    </li>
                }
            </ul>
        )
    }
}
