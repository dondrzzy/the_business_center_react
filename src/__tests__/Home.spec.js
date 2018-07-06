import React from 'react';
import { shallow, mount } from 'enzyme';
import Home from '../components/Home';
import { MemoryRouter } from 'react-router-dom';

describe(<Home />, () => {
    let wrapper;
    let component;
    beforeEach(() => {
        wrapper = shallow(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )
        component = wrapper.find(Home).dive()
    })
    it('Should contain register button', () => {
        expect(component.find("#registerBtn").length).toEqual(1)
    });
});
