import React from 'react';
import { shallow, mount } from 'enzyme';
import Businesses from '../../components/businesses/index';
// import { MemoryRouter } from 'react-router-dom';
import * as BusinessActions from '../../actions/BusinessActions';
import BusinessStore from '../../stores/BusinessStore';
import axios from 'axios';
import renderer from 'react-test-renderer';


describe('<Businesses />', () => {
  axios.get.mockImplementationOnce(
      jest.fn(()=> Promise.resolve({
        data:{
          success:true
        }
      }))
    )

  it('should call lifecycle methods', ()=>{
    jest.spyOn(Businesses.prototype, 'componentWillUnmount');
    
    const wrapper = mount(
      <Businesses />
    );
    wrapper.unmount()
    expect(Businesses.prototype.componentWillUnmount).toHaveBeenCalled();
  });

  it('should call getBusinesses', async () => {
    const spy = jest.spyOn(Businesses.prototype, 'getBusinesses');
     axios.get.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{
            success:true,
            businesses:[],
            next_page:'2',
            prev_page: ''
          }
        }))
      )
    const wrapper = mount(
    	<Businesses />
    );
    const form = wrapper.find('form');
    const name = form.find("input[name='q']");
    const category = form.find("input[name='category']");
    const location = form.find("input[name='category']");
    name.instance().value = 'Business';
    category.instance().value = "Category";
    location.instance().value = 'Location';
    await wrapper.find('form').simulate('submit');
    console.log(wrapper.state())
    expect(spy).toHaveBeenCalled()
  });

  // it('should call handleChangeSearch on search change', () => {
  //   const spy = jest.spyOn(Businesses.prototype, 'handleChangeSearch');
  //   const event = {target: {name: 'q', value: 'spam'}}
  //   const wrapper = mount(
  //   	<Businesses />
  //   );
  //   wrapper.find("input[name='q']").simulate('change', event);
  //   expect(spy).toHaveBeenCalled()
  // });
  // it('should call handleChangeCategory on category change', () => {
  //   const spy = jest.spyOn(Businesses.prototype, 'handleChangeCategory');
  //   const event = {target: {name: 'category', value: 'spam'}}
  //   const wrapper = mount(
  //   	<Businesses />
  //   );
  //   wrapper.find("input[name='category']").simulate('change', event);
  //   expect(spy).toHaveBeenCalled();
  // });
  // it('should call handleChangeLocation on location change', () => {
  //   const spy = jest.spyOn(Businesses.prototype, 'handleChangeLocation');
  //   const event = {target: {name: 'location', value: 'spam'}}
  //   const wrapper = mount(
  //   	<Businesses />
  //   );
  //   wrapper.find("input[name='location']").simulate('change', event);
  //   expect(spy).toHaveBeenCalled();
  // });
  // it('should call handleLimitChange on limit change', () => {
  //   const spy = jest.spyOn(Businesses.prototype, 'handleLimitChange');
  //   const event = {target: {name: 'limit', value: '50'}}
  //   const wrapper = mount(
  //   	<Businesses />
  //   );
  //   wrapper.find("select[name='limit']").simulate('change', event);
  //   expect(spy).toHaveBeenCalled();
  // });
  // it('should call handleSetPage on page change', () => {
  //   const spy = jest.spyOn(Businesses.prototype, 'handleSetPage');
  //   const wrapper = mount(
  //   	<Businesses />
  //   );
  //   wrapper.setState({
  //     businessWrap : {
  //       businesses:[],
  //       next_page:'2',
  //       prev_page:''
  //     }
  //   });
  //   wrapper.find("a[className='page-link']").simulate('click');
  //   expect(spy).toHaveBeenCalled();
  // });
})