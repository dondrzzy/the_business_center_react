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

  it('should submit valid form', ()=>{
    jest.mock('../../actions/UserActions');
    const spy = jest.spyOn(UserActions, 'registerUser');
    
    const location = {'state':{'from':'/login'}};
    const wrapper = mount(
      <MemoryRouter>
        <Register location={location} />
      </MemoryRouter>
    );
    const form = wrapper.find('form');
    const name = form.find("input[type='text']");
    const email = form.find("input[name='email']");
    const password = form.find("input[name='password']");
    const confirmPassword = form.find("input[name='confirmPassword']");
    name.instance().value = 'donald sibo';
    email.instance().value = 'a@gmail.com';
    password.instance().value = "#x@123456";
    confirmPassword.instance().value = "#x@123456";
    wrapper.find('form').simulate('submit');
    expect(spy).toHaveBeenCalled();
  });

  describe('Form validation', ()=>{
    
    it('should validate empty form inputs', ()=>{
      const location = {'state':{'from':'/login'}};
      const wrapper = mount(
        <MemoryRouter>
          <Register location={location}/>
        </MemoryRouter>
      );
      expect(wrapper.find('Register').instance().state.formValidated).toEqual('');
      const form = wrapper.find('form');
      const name = form.find("input[type='text']");
      const email = form.find("input[name='email']");
      const password = form.find("input[name='password']");
      const confirmPassword = form.find("input[name='confirmPassword']");
      name.instance().value = '';
      email.instance().value = '';
      password.instance().value = '';
      confirmPassword.instance().value = '';
      form.simulate('submit');
      expect(wrapper.find('Register').instance().state.formValidated).toEqual('wasValidated');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
    });

    it('should show invalid form inputs', ()=>{
      const location = {'state':{'from':'/login'}};
      const wrapper = mount(
        <MemoryRouter>
          <Register location={location}/>
        </MemoryRouter>
      );
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');

      const form = wrapper.find('form');
      const name = form.find("input[type='text']");
      const email = form.find("input[name='email']");
      const password = form.find("input[name='password']");
      const confirmPassword = form.find("input[name='confirmPassword']");
      name.instance().value = 'a';
      email.instance().value = 'a';
      password.instance().value = '';
      confirmPassword.instance().value = 'a';
      form.simulate('submit');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('Please enter a valid email');
    });

    it('should check for password mismatch', ()=>{
      const location = {'state':{'from':'/login'}};
      const wrapper = mount(
        <MemoryRouter>
          <Register location={location}/>
        </MemoryRouter>
      );
      expect(wrapper.find('Register').instance().state.confirmPasswordMessage)
        .toEqual("This field is required");

      const form = wrapper.find('form');
      const name = form.find("input[type='text']");
      const email = form.find("input[name='email']");
      const password = form.find("input[name='password']");
      const confirmPassword = form.find("input[name='confirmPassword']");
      name.instance().value = 'a';
      email.instance().value = 'a';
      password.instance().value = 'b';
      confirmPassword.instance().value = 'a';
      form.simulate('submit');
      expect(wrapper.find('Register').instance().state.confirmPasswordMessage)
        .toEqual("Passwords do not match");
    });
  });
});
