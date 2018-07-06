import React from 'react';
import { shallow, mount } from 'enzyme';
import ResetPassword from '../../components/auth/ResetPassword';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

let wrapper,
      component;
let location = {'state':{'from':'/login'}};
let match = {params:{token:"hsdhjgvdgvhsd"}}
describe('<ResetPassword />', () => {
  beforeEach(() => {
    axios.post.mockImplementation(
      jest.fn(()=> Promise.resolve({ 
        data:{
          success:true,
          user:'abc@gmail.com' 
          }
      }))
    )
    wrapper = shallow(
      <MemoryRouter>
        <ResetPassword location={location} match={match} />
      </MemoryRouter>
    );
    component = wrapper.find(ResetPassword).dive()
  });
  afterEach(() => {
    wrapper.unmount()
  })

  it('should load <ResetPassword/> on valid token', async () => {
    wrapper = await mount(
      <MemoryRouter>
        <ResetPassword location={location} match={match} />
      </MemoryRouter>
    );
    expect(wrapper.find(ResetPassword)).toHaveLength(1);
    wrapper.unmount()
  });
  it('should redirect to forgot password on invalid token', async ()=>{
    axios.post.mockImplementationOnce(
      jest.fn(()=> Promise.resolve({ 
        data:{
          success:false,
          message:'Token expired' 
          }
      }))
    )
    wrapper = await mount(
      <MemoryRouter>
        <ResetPassword location={location} match={match} />
      </MemoryRouter>
    );
    expect(wrapper.find(ResetPassword).instance().state.redirectToForgot).toBeTruthy();
  });

  it('should validate empty form inputs', ()=>{
    
    component.setState({
      verified: true,
      loaderStyle:{display:"none"},
      resetUserEmail: 'abc@gmail.com',
      alertMessage: "Account email: a@gmail.com"
    })
    let form = component.find('form');
    form.find("input[name='password']").simulate('change', {target: {value: ""}});
    form.find("input[name='confirmPassword']").simulate('change', {target: {value: ""}});
    form.simulate('submit', {preventDefault: () => {}});
    expect(component.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
    expect(component.state().formValidated).toContain('wasValidated');
  });

  it('should validate invalid form inputs', ()=>{
    component.setState({
      verified: true,
      loaderStyle:{display:"none"},
      resetUserEmail: 'abc@gmail.com',
      alertMessage: "Account email: a@gmail.com"
    })
    let form = component.find('form');
    form.find("input[name='password']").simulate('change', {target: {value: "#aee"}});
    form.find("input[name='confirmPassword']").simulate('change', {target: {value: "#secwe"}});
    form.simulate('submit', {preventDefault: () => {}});
    expect(component.find('.feedback.invalid-feedback').first().text())
        .toContain('Password should have 6 - 35 characters');
    expect(component.state().formValidated).toContain('wasValidated');
  });

  it('should submit valid form inputs', async ()=>{
    component.setState({
      verified: true,
      loaderStyle:{display:"none"},
      resetUserEmail: 'abc@gmail.com',
      alertMessage: "Account email: a@gmail.com"
    })
    let form = component.find('form');
    form.find("input[name='password']").simulate('change', {target: {value: "#x@12345"}});
    form.find("input[name='confirmPassword']").simulate('change', {target: {value: "#x@12345"}});
    await form.simulate('submit', {preventDefault: () => {}});
    expect(component.state().isReset).toBeTruthy();
  });
});

describe('Reset password with invalid toek server error', () => {

  beforeEach(() => {
    axios.post.mockImplementation(
      jest.fn(()=> Promise.reject({
        response: {
          data:{
            success:false,
            message:'Invalid reset token' 
          }
        }
      }))
    );
     wrapper = shallow(
      <MemoryRouter>
        <ResetPassword location={location} match={match} />
      </MemoryRouter>
    );
   component = wrapper.find(ResetPassword).dive()
  });
  afterEach(() => {
    wrapper.unmount()
  });

  it('should redirect user on passing invalid token', () => {
    expect(component.state().redirectToForgot).toBeTruthy();
  });
})

describe('Reset password with invalid form', () => {

  beforeEach(() => {
    axios.post.mockImplementation(
      jest.fn(()=> Promise.reject({
        response: {
          data:{
            success:false,
            message:'Invalid reset token' 
          }
        }
      }))
    );
     wrapper = shallow(
      <MemoryRouter>
        <ResetPassword location={location} match={match} />
      </MemoryRouter>
    );
   component = wrapper.find(ResetPassword).dive()
  });
  afterEach(() => {
    wrapper.unmount()
  });

  it('should set state with error message from server', () => {
    component.setState({
      redirectToForgot:false,
      isReset: false,
      verified: true,
    });
    let form = component.find('form');
    form.find("input[name='password']").simulate('change', {target: {value: "#x@12345"}});
    form.find("input[name='confirmPassword']").simulate('change', {target: {value: "#x@12345"}});
    form.simulate('submit', {preventDefault: () => {}});
    setImmediate(() => {
      expect(component.state().alertMessage).toBe('Invalid reset token')
    });
  });
});
