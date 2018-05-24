import React from 'react';
import { shallow, mount } from 'enzyme';
import ReviewItem from '../components/Reviews/ReviewItem';
import App from '../App';

describe('<App />', () => {
  // beforeAll(() => {
  //   const ls = require("../utils/localStorage.js");
  //   ls.setLocalStorage();
  //   console.log(localStorage)
  // });
  it('renders without regression', ()=>{
    const wrapper = shallow(<App />);
    console.log(wrapper.instance());
  })
});