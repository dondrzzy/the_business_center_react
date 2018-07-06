import React from 'react';
import { shallow, mount } from 'enzyme';
import Register from '../../components/auth/Register';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import axios from 'axios';
import { after } from 'glamor';

describe('<Register />', () => {
	let wrapper,
			component;
	let location = {'state':{'from':'/login'}};
  beforeEach(() => {
		wrapper = mount(
      <MemoryRouter>
        <Register location={location} />
      </MemoryRouter>
		);
	});
	
	afterEach(() => {
		wrapper.unmount();
	})

  it('should submit valid form', ()=>{
    const spy = jest.spyOn(UserActions, 'registerUser');
    const form = wrapper.find('form');
    form.find("input[type='text']").instance().value = 'donald sibo';
    form.find("input[name='email']").instance().value = 'a@gmail.com';
    form.find("input[name='password']").instance().value = "#x@123456";
    form.find("input[name='confirmPassword']").instance().value = "#x@123456";
    wrapper.find('form').simulate('submit');
    expect(spy).toHaveBeenCalled();
  });

  describe('Form validation', ()=>{
    it('should validate empty form inputs', ()=>{
      expect(wrapper.find('Register').instance().state.formValidated).toEqual('');
      const form = wrapper.find('form');
      form.find("input[type='text']").instance().value = '';
      form.find("input[name='email']").instance().value = '';
      form.find("input[name='password']").instance().value = '';
      form.find("input[name='confirmPassword']").instance().value = '';
      form.simulate('submit');
      expect(wrapper.find('Register').instance().state.formValidated).toEqual('wasValidated');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
    });

    it('should show invalid form inputs', ()=>{
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
      const form = wrapper.find('form');
      form.find("input[type='text']").instance().value = 'a';
      form.find("input[name='email']").instance().value = 'a';
      form.find("input[name='password']").instance().value = '';
      form.find("input[name='confirmPassword']").instance().value = 'a';
      form.simulate('submit');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('Please enter a valid name');
    });

    it('should check for password mismatch', ()=>{
      expect(wrapper.find('Register').instance().state.confirmPasswordMessage)
        .toEqual("This field is required");
      const form = wrapper.find('form');
      form.find("input[type='text']").instance().value = 'a';
      form.find("input[name='email']").instance().value = 'a';
      form.find("input[name='password']").instance().value = 'b';
      form.find("input[name='confirmPassword']").instance().value = 'a';
      form.simulate('submit');
      expect(wrapper.find('Register').instance().state.confirmPasswordMessage)
        .toEqual("Passwords do not match");
    });
  });
});
