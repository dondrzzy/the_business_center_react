import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import Navbar from '../components/layout/Navbar';
import Routes from '../routes/index';

describe('<App />', () => {

  it('should not contain wrong component', ()=>{
    const wrapper = shallow(<App />);
    expect(wrapper.containsMatchingElement(<xxx/>)).toEqual(false);
  });

  it('should contain the navbar component', ()=>{
    const wrapper = shallow(<App />);
    expect(wrapper.containsMatchingElement(<Navbar/>)).toEqual(true);
  });

  it('should contain the routes component', ()=>{
    const wrapper = shallow(<App />);
    expect(wrapper.containsMatchingElement(<Routes/>)).toEqual(true);
  });

  it('should update state isLoggedIn true', ()=>{
    const wrapper = mount(<App />);
    wrapper.find('Routes').props().auth();
    expect(wrapper.state().isLoggedIn).toBe(false)
    wrapper.find('Routes').props().auth('signin');
    expect(wrapper.state().isLoggedIn).toBe(true)
  });
});