import React from 'react';
import { shallow, mount } from 'enzyme';
import Logout from '../../components/auth/Logout';
import axios from 'axios';

describe('<Logout />', () => {
  
  it('should call lifecycle methods', async () => {
    window.localStorage.setItem('jwt', JSON.stringify("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsImV4cCI6MTUzMTMzMTEwN30.ONQTRwKWaMS-RD618plLzW5327VZcZ-xZ2iUzDiltqc"));
    axios.get.mockImplementationOnce(
      jest.fn(()=> Promise.resolve({ 
        data:{success:true, message:'Successfully logged out'}
      }))
    );
    const wrapper = await shallow(
        <Logout />
    );
    expect(wrapper.state().redirectToLogin).toBeTruthy();
    window.localStorage.removeItem('jwt');
    wrapper.unmount();
  });

  it('should call lifecycle methods', async ()=>{
    axios.get.mockImplementationOnce(
      jest.fn(()=> Promise.reject({
        response: {
          data:{
            success:false,
            token: false,
            message:'Invalid token'
          }
        }
      }))
    );
    const wrapper = shallow(<Logout />);
    await wrapper.instance().componentDidMount()
    expect(wrapper.state().redirectToLogin).toBeTruthy();
    wrapper.unmount();
  });

  it('should call lifecycle methods', async ()=>{
    axios.get.mockImplementationOnce(
      jest.fn(()=> Promise.reject({
        data:{
          success:false,
          token: false,
          message:'Invalid token'
        }
      }))
    );
    const wrapper = shallow(<Logout />);
    await wrapper.instance().componentDidMount();
    expect(wrapper.state().redirectToLogin).toBeTruthy();
    wrapper.unmount();
  });
});
