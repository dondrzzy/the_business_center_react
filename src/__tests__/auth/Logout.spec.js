import React from 'react';
import { shallow, mount } from 'enzyme';
import Logout from '../../components/auth/Logout';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import axios from 'axios';

describe('<Logout />', () => {
  
  it('should call lifecycle methods', async ()=>{
    axios.get.mockImplementationOnce(
      jest.fn(()=> Promise.resolve({ 
        data:{success:true, message:'Successfully logged out'}
      }))
    );
    const wrapper = await shallow(
        <Logout />
    );
    expect(wrapper.state().redirectToLogin).toBeTruthy();
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
});
