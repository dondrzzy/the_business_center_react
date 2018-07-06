import React from 'react';
import { shallow, mount } from 'enzyme';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import axios from 'axios';
import sinon from 'sinon';



describe('<Login />', () => {
  let location = {'state':{'from':'/businesses'}};
  let wrapper;
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
    