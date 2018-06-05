import React from 'react';
import { shallow, mount } from 'enzyme';
import Logout from '../../components/auth/Logout';
import { MemoryRouter } from 'react-router-dom';
import * as UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import axios from 'axios';

describe('<Logout />', () => {
  
  it('should call lifecycle methods', async ()=>{
    jest.spyOn(Logout.prototype, 'componentWillUnmount');
    axios.post.mockImplementationOnce(
      jest.fn(()=> Promise.resolve({ 
        data:{success:true},
        message:'Successfully logged out' 
      }))
    )
    const wrapper = await mount(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    wrapper.unmount()
    expect(Logout.prototype.componentWillUnmount).toHaveBeenCalled();
  });
});
