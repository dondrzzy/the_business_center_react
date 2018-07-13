import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import UserStore from '../../stores/UserStore';

describe(<Navbar />, () => {
    it('should display dashboard link for logged in user', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        );
        const component = wrapper.find('Navbar').dive();
        component.setState({
            isAuthenticated: true
        });
        wrapper.update();
        expect(component.find('NavLink[to="/dashboard"]')).toHaveLength(1);
    });
    it('should display dashboard link for logged in user', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        );
        const component = wrapper.find('Navbar').dive();
        const res = {
            success: true,
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsImV4cCI6MTUzMTMzMTEwN30.ONQTRwKWaMS-RD618plLzW5327VZcZ-xZ2iUzDiltqc'
        }
        UserStore.loginUser(res);
        expect(component.state()).toBeTruthy();
    });
})