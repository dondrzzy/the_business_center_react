import React from 'react';
import { shallow, mount } from 'enzyme';
import ForgotPassword from '../../components/auth/ForgotPassword';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

describe('<ForgotPassword />', () => {
  let wrapper,
      component;
  beforeEach(() => {
    axios.post.mockImplementation(
      jest.fn(()=> Promise.resolve({ 
        data:{
          success:true,
          message:'A link has been sent to: abc@gmail.com'
          }
      }))
    )
    wrapper = shallow(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    component = wrapper.find(ForgotPassword).dive()
  });
  afterEach(() => {
    component.unmount();
    wrapper.unmount()
  });

  it('should validate empty form input', ()=>{
    let form = component.find('form');
    form.find("input[name='email']").simulate('change', {target: {value: ""}});
    form.simulate('submit', {preventDefault: () => {}});
    expect(component.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
    expect(component.state().formValidated).toContain('wasValidated');
  });

  it('should validate invalid form input', () => {
    let form = component.find('form');
    form.find("input[name='email']").simulate('change', {target: {value: "whewehsd"}});
    form.simulate('submit', {preventDefault: () => {}});
    expect(component.find('.feedback.invalid-feedback').first().text())
        .toContain('Please enter a valid email');
    expect(component.state().formValidated).toContain('wasValidated');
  });

  it('should submit valid form inputs', async () => {
    let form = component.find('form');
    form.find("input[name='email']").simulate('change', {target: {value: "abc@gmail.com"}});
    await form.simulate('submit', {preventDefault: () => {}});
    expect(component.state().message).toEqual('A link has been sent to: abc@gmail.com');
  });

  it('should load server error', () => {
    axios.post.mockImplementationOnce(
			jest.fn(()=> Promise.reject({
        response: {
          data:{
            success: false,
            message: "User not found"
          }
        }
			}))
		);
    let wrapper = shallow(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    let component = wrapper.find(ForgotPassword).dive()
    component.setState({
      report: {
        'status':'error',
        'message':'Token is expired'
      }
    })
    let form = component.find('form');
    form.find("input[name='email']").simulate('change', {target: {value: "abc@gmail.com"}});
    form.simulate('submit', {preventDefault: () => {}});
    setImmediate(() => {
      expect(component.state().message).toBe('User not found');
    });
  });
});
