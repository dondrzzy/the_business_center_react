import React from 'react';
import { shallow, mount } from 'enzyme';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import axios from 'axios';
import sinon from 'sinon';



describe('<Login />', () => {
  
  it('should call lifecycle methods', ()=>{
    jest.spyOn(Login.prototype, 'componentWillUnmount');
    const location = {'state':{'from':'/businesses'}};
    const wrapper = mount(
      <MemoryRouter>
        <Login location={location}/>
      </MemoryRouter>
    );
    wrapper.unmount()
    expect(Login.prototype.componentWillUnmount).toHaveBeenCalled();
  });

  it('should call handleSubmit on form submit', ()=>{
    jest.spyOn(Login.prototype, 'handleSubmit');
    const location = {'state':{'from':'/businesses'}};
    const wrapper = mount(
      <MemoryRouter>
        <Login location={location}/>
      </MemoryRouter>
    );
    wrapper.find('form').simulate('submit');
    expect(Login.prototype.handleSubmit).toHaveBeenCalled();
  });

  it('should display API errors', ()=>{
    const location = {'state':{'from':'/businesses'}};
    const wrapper = mount(
      <MemoryRouter>
        <Login location={location}/>
      </MemoryRouter>
      );
    const form = wrapper.find('form');
    const email = form.find("input[type='email']");
    const password = form.find("input[type='password']");
      axios.post.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{success:false},
          message:'User not found' 
        }))
      )
      email.instance().value = 'a@gmail.com';
      password.instance().value = "#x@123456";
      wrapper.find('form').simulate('submit');
      wrapper.unmount();
  });

  it('should display API errors', ()=>{
    const location = {'state':{'from':'/businesses'}};
    const wrapper = mount(
      <MemoryRouter>
        <Login location={location}/>
      </MemoryRouter>
      );
    const form = wrapper.find('form');
    const email = form.find("input[type='email']");
    const password = form.find("input[type='password']");
      axios.post.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{success:true},
          token:'#jsddvbsdcby33767ebybce' 
        }))
      )
      email.instance().value = 'a@gmail.com';
      password.instance().value = "#x@123456";
      wrapper.find('form').simulate('submit');
  });
  
  it('should submit valid form', async ()=>{
    jest.mock('../../actions/UserActions');
    const spy = jest.spyOn(UserActions, 'authenticate_user');
    
    const location = {'state':{'from':'/businesses'}};
    const wrapper = mount(
      <MemoryRouter>
        <Login location={location} />
      </MemoryRouter>
    );
    const form = wrapper.find('form');
    const email = form.find("input[type='email']");
    const password = form.find("input[type='password']");
    email.instance().value = 'a@gmail.com';
    password.instance().value = "#x@123456";
    wrapper.find('form').simulate('submit');
    expect(spy).toHaveBeenCalled();
  });

  describe('Form validation', ()=>{

    it('should validate empty form inputs', ()=>{
      const location = {'state':{'from':'/businesses'}};
      const wrapper = mount(
        <MemoryRouter>
          <Login location={location}/>
        </MemoryRouter>
      );
      expect(wrapper.find('Login').instance().state.formValidated).toEqual('');
      const form = wrapper.find('form');
      const email = form.find("input[type='email']");
      const password = form.find("input[type='password']");
      email.instance().value = "";
      password.instance().value = "";
      form.simulate('submit');
      expect(wrapper.find('Login').instance().state.formValidated).toEqual('wasValidated');
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
    });

    it('should show invalid form inputs', ()=>{
      const location = {'state':{'from':'/businesses'}};
      const wrapper = mount(
        <MemoryRouter>
          <Login location={location}/>
        </MemoryRouter>
      );
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');

      const form = wrapper.find('form');
      const email = form.find("input[type='email']");
      const password = form.find("input[type='password']");
      email.instance().value = "a";
      password.instance().value = "a";
      form.simulate('submit');
      expect(wrapper.find('.feedback.invalid-feedback').text())
        .toContain('Please enter a valid email');
    });
  });
});
    