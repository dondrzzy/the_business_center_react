import React from 'react';
import { shallow, mount } from 'enzyme';
import Businesses from '../../components/businesses/index';
// import { MemoryRouter } from 'react-router-dom';
import * as BusinessActions from '../../actions/BusinessActions';
import BusinessStore from '../../stores/BusinessStore';
import axios from 'axios';

describe('<Businesses />', () => {
  
  it('should call lifecycle methods', ()=>{
    jest.spyOn(Businesses.prototype, 'componentWillUnmount');
    const wrapper = mount(
        <Businesses />
    );
    wrapper.unmount()
    expect(Businesses.prototype.componentWillUnmount).toHaveBeenCalled();
  });
  it('should call handleSubmit on form submit', ()=>{
    jest.spyOn(Businesses.prototype, 'handleSubmit');
    const wrapper = mount(
    	<Businesses />
    );
    wrapper.find('form').simulate('submit');
    expect(Businesses.prototype.handleSubmit).toHaveBeenCalled();
  });
})