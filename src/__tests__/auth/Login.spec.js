import React from 'react';
import { Redirect } from 'react-router-dom'
import { shallow, mount } from 'enzyme';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import axios from 'axios';
import { copyFile } from 'fs';
import { UserStore } from '../../stores/UserStore';

let location = {'state':{'from':'/businesses'}};
let wrapper, component;

describe('Login component', () => {
	beforeEach(() => {
		axios.post.mockImplementation(
			jest.fn(()=> Promise.reject({
			response: {
				data:{
				success: false,
				message: "User not found"
				}
			}
			}))
		);
		wrapper =  shallow(
			<MemoryRouter>
				<Login location={location}/>
			</MemoryRouter>
		);
		component = wrapper.find(Login).dive()
	});
	afterEach( () => {
		wrapper.unmount();
	});
	it('should set state message on invalid login', () => {
		component.find("input[name='email']")
			.simulate('change', {target: {value: 'johndoe@gmail.com'}});
		component.find("input[name='password']")
			.simulate('change', {target: {value: '#xxx@2017'}})
		component.find('form').simulate('submit', {preventDefault: () => {}});
		setImmediate(() => {
      expect(component.state().message).toBe('User not found');
      component.instance().componentWillUnmount();
		});
  });
});

describe('<Login />', () => {

  beforeEach(() =>{
    wrapper = mount(
      <MemoryRouter>
        <Login location={location}/>
      </MemoryRouter>
    );
  });
  afterEach(() => {
    wrapper.unmount();
  })

  it('should call handleSubmit on form submit', ()=>{
    const spy = jest.spyOn(wrapper.find(Login).instance(), 'handleSubmit');
    wrapper.find(Login).instance().forceUpdate()
    wrapper.find('form').simulate('submit');
    expect(spy).toHaveBeenCalled();
  });

  describe('Form validation', ()=>{

    it('should validate empty form inputs', ()=>{
      expect(wrapper.find('Login').instance().state.formValidated).toEqual('');
      const form = wrapper.find('form');
      form.find("input[type='email']").simulate('change', {target: {value: ""}});
      form.find("input[type='password']").simulate('change', {target: {value: ""}});
      form.simulate('submit');
      expect(wrapper.find('Login').instance().state.formValidated).toEqual('wasValidated');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
    });

    it('should show invalid form inputs', ()=>{
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
      const form = wrapper.find('form');
      form.find("input[type='email']").simulate('change', {target: {value: "a"}});
      form.find("input[type='password']").simulate('change', {target: {value: "a"}});
      form.simulate('submit');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('Please enter a valid email');
    });
  });
  it('should submit valid form', async () => {
      const spy = jest.spyOn(UserActions, 'authenticateUser');
      wrapper.find(Login).instance().forceUpdate();
      axios.post.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{
            success:true,
            token:'#jsddvbsdcby33767ebybce' 
            }
        }))
      )
      const form = wrapper.find('form');
      form.find("input[type='email']").simulate('change', {target: {value: "abc@gmail.com"}});
      form.find("input[type='password']").simulate('change', {target: {value: "#x@123456"}});
      await wrapper.find('form').simulate('submit');
      expect(spy).toHaveBeenCalled();
    });
});
    