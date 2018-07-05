import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import UserStore from '../stores/UserStore';
import PrivateRoute from '../components/auth/PrivateRoute';

class TestComponent extends Component{
    render(){
        return (
            <h1>Test Component</h1>
        )
    }
}

describe(<PrivateRoute />, () => {
    it('renders passed component when user is authenticated', () => {
        UserStore.isLoggedIn = jest.fn(() => true);
        let wrapper = mount(
            <MemoryRouter>
                <PrivateRoute  component={TestComponent}/>
            </MemoryRouter>
            
        )
        expect(wrapper.find(TestComponent)).toHaveLength(1);
    });
});
