import React from 'react';
import { shallow, mount } from 'enzyme';
import Routes from '../routes/Index';
import { MemoryRouter } from 'react-router-dom';

describe(<Routes />, () => {
    let wrapper;
    let component;
    beforeEach(() => {
        wrapper = shallow(
            <MemoryRouter>
                <Routes />
            </MemoryRouter>
        )
        component = wrapper.find(Routes).dive()
    })
    it('Should return a switch with routes', () => {
        expect(component.find("Switch").length).toEqual(1)
        expect(component.find("Route").length).toBeGreaterThan(0)
    });

});