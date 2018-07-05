import React from 'react';
import { shallow, mount } from 'enzyme';
import BusinessList from '../../components/businesses/BusinessList';
import BusinessItem from '../../components/businesses/BusinessItem';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

describe(<BusinessList />, () => {
    let wrapper;

    it('should return no business when there are not there', ()=>{
        wrapper = shallow(
            <BusinessList 
                categoryOptions={[]}
                businesses={[]}
                uid={1}
                viewOptionsButtons={jest.fn()}
            />
        );
        expect(wrapper.find('.u-b').html()).toContain("No business found");
    });

    it('should return a business items list', ()=>{
        wrapper = shallow(
            <MemoryRouter>
                <BusinessList 
                    categoryOptions={[]}
                    businesses={[
                        {
                            name: 'name',
                            location: 'kampala',
                            category: {
                                id: 1,
                                status: 'Approved',
                                category: 'IT'
                            },
                            id:1
                        }
                    ]}
                    uid={1}
                    viewOptionsButtons={jest.fn()}
                />
            </MemoryRouter>
        );
        let component = wrapper.find(BusinessList).dive();
        expect(component.find(BusinessItem)).toHaveLength(1);
    });
})
