import React from 'react';
import { shallow, mount } from 'enzyme';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';
import mockUserAction from '../../actions/UserActions';
import axios from 'axios';

describe('<Login />', () => {
  const location = {'state':{'from':'/'}};
  const wrapper = mount(
    <MemoryRouter>
      <Login location={location} />
    </MemoryRouter>
    );
  const form = wrapper.find('form');
  const email = form.find("input[type='email']");
  const password = form.find("input[type='password']");

  it('should submit valid form', ()=>{
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

  // describe('Form validation', ()=>{

  //   it('should not submit empty form inputs', ()=>{
  //       email.instance().value = "";
  //       password.instance().value = "";
  //       // console.log(email.props());
  //       wrapper.find('form').simulate('submit');
  //   });

  //   it('should not submit invalid form inputs', ()=>{
  //       email.instance().value = "a";
  //       password.instance().value = "a";
  //       // console.log(email.props());
  //       wrapper.find('form').simulate('submit');
  //   });
  // })
});