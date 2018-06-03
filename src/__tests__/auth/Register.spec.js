import React from 'react';
import { shallow, mount } from 'enzyme';
import Register from '../../components/auth/Register';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import axios from 'axios';

describe('<Register />', () => {
  
  it('should call lifecycle methods', ()=>{
    jest.spyOn(Register.prototype, 'componentWillUnmount');
    const wrapper = mount(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    wrapper.unmount()
    expect(Register.prototype.componentWillUnmount).toHaveBeenCalled();
  });
});