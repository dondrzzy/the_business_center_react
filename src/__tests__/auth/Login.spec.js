import React from 'react';
import { shallow, mount } from 'enzyme';
import Login from '../../components/auth/Login';
import { MemoryRouter } from 'react-router-dom';
import mockUserAction from '../../actions/UserActions';
import axios from 'axios';
import sinon from 'sinon';

// beforeEach(() => {
//   const willUnmount = sinon.spy();
//   let props = {
//     componentWillUnmount: willUnmount
//   };
// });

describe('<Login />', () => {
  
  const willUnmount = sinon.spy();
  const componentDidMount = jest.fn()
 
  class Foo extends Login {
    constructor(props) {
      super(props)
      this.componentDidMount = componentDidMount
    }

    render() {
      return (<Login />)
    }
  }
  it('should submit valid form', ()=>{


    
    const wrapper = mount(
      <MemoryRouter>
        <Foo />
      </MemoryRouter>
      );
    // const form = wrapper.find('form');
    // const email = form.find("input[type='email']");
    // const password = form.find("input[type='password']");
    //   axios.post.mockImplementationOnce(
    //     jest.fn(()=> Promise.resolve({ 
    //       data:{success:true},
    //       token:'#jsddvbsdcby33767ebybce' 
    //     }))
    //   )
    //   email.instance().value = 'a@gmail.com';
    //   password.instance().value = "#x@123456";
      // wrapper.find('form').simulate('submit');
      // wrapper.unmount();
      // expect(willUnmount.callCount).to.equal(0);
      expect(componentDidMount.mock.calls.length).toBe(1)
      console.log(wrapper.props())
  });

  // it('should not login unknown user', ()=>{
  //   const location = {'state':{'from':'/businesses'}};
  //   const wrapper = mount(
  //     <MemoryRouter>
  //       <Login />
  //     </MemoryRouter>
  //     );
  //   const form = wrapper.find('form');
  //   const email = form.find("input[type='email']");
  //   const password = form.find("input[type='password']");
  //     axios.post.mockImplementationOnce(
  //       jest.fn(()=> Promise.resolve({ 
  //         data:{success:false},
  //         message:'User not found' 
  //       }))
  //     )
  //     email.instance().value = 'a@gmail.com';
  //     password.instance().value = "#x@123456";
  //     wrapper.find('form').simulate('submit');
  //     wrapper.unmount();
  // });

  // describe('Form validation', ()=>{

  //   it('should not submit empty form inputs', ()=>{
  //     const location = {'state':{'from':'/businesses'}};
  //     const wrapper = mount(
  //       <MemoryRouter>
  //         <Login />
  //       </MemoryRouter>
  //       );
  //     const form = wrapper.find('form');
  //     const email = form.find("input[type='email']");
  //     const password = form.find("input[type='password']");
  //       email.instance().value = "";
  //       password.instance().value = "";
  //       wrapper.find('form').simulate('submit');
  //   });

  //   it('should not submit invalid form inputs', ()=>{
  //     const location = {'state':{'from':'/businesses'}};
  //     const wrapper = mount(
  //       <MemoryRouter>
  //         <Login />
  //       </MemoryRouter>
  //       );
  //     const form = wrapper.find('form');
  //     const email = form.find("input[type='email']");
  //     const password = form.find("input[type='password']");
  //       email.instance().value = "a";
  //       password.instance().value = "a";
  //       wrapper.find('form').simulate('submit');
  //   });
  // });
});