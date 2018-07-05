import React from 'react';
import { shallow, mount } from 'enzyme';
import Businesses from '../../components/businesses/Businesses';
import * as BusinessActions from '../../actions/BusinessActions';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

describe(<Businesses />, () => {
  let wrapper;
  beforeEach(() => {
    axios.get.mockImplementation(
      jest.fn(()=> Promise.resolve({
        data:{
          success: true,
          businesses: [],
          categories: [
            {
              category: 'IT',
              status:'Approved',
              id: 1
            }
          ],
          total: 0,
          next_page: '',
          prev_page: 1
        }
      }))
    );
    wrapper = mount(
    	<Businesses />
    );
  })

  afterEach( () => {
    wrapper.unmount()
  });
  

  it('should validate empty search fields', ()=>{
    wrapper.find('form').simulate('submit');
    expect(wrapper.find('.feedback').html()).toContain('Please fill any of the form fields');
  });

  it('should validate submit valid search form', ()=>{
    const spy = jest.spyOn(BusinessActions, 'getBusinesses');
    wrapper.find("input[name='q']").simulate('change', {target :{value: 'andela'}});
    wrapper.find("input[name='location']").simulate('change', {target :{value: 'andela'}});
    wrapper.find("select[name='category']").simulate('change', {target :{value: '1'}});
    wrapper.find('form').simulate('submit');
    expect(spy).toHaveBeenCalled();
  });

  it('should change limit', ()=>{
    const spy = jest.spyOn(BusinessActions, 'getBusinesses');
    wrapper.find("select[name='limit']").simulate('change', {target :{value: '10'}});
    expect(spy).toHaveBeenCalled();
  });

  it('should change paginate', ()=>{
    wrapper = shallow(<Businesses/>);
    wrapper.setState({
      businessWrap:{
        businesses: [],
        next_page: 3,
        prev_page: 2,
        categories: []
      }
    });
    wrapper.find("#prev-link").simulate('click');
    expect(wrapper.state().params.page).toEqual(2);

  });
})
