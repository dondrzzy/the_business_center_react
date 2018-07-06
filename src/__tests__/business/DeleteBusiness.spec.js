import React from 'react';
import { shallow, mount } from 'enzyme';
import DeleteBusiness from '../../components/businesses/DeleteBusiness';
import * as BusinessActions from '../../actions/BusinessActions';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

describe(<DeleteBusiness />, () => {
    let wrapper;
    let business = {
        name: 'name',
        location: 'kampala',
        category: {
            id: 1,
            status: 'Approved',
            category: 'IT'
        },
        id:1,
        user:{ 
            name: 'John Doe',
            id: 1
        }
    }
    let categoryOptions = []
    beforeEach(() => {
        wrapper = mount(
            <DeleteBusiness
                business={business}
            />
        );
    });

    afterEach( () => {
        wrapper.unmount()
    });

    it('it should call mountAlertComponent on button click', async () => {
        const spy = jest.spyOn(wrapper.instance(), 'mountAlertComponent');
        axios.delete.mockImplementationOnce(
            jest.fn(()=> Promise.resolve({
            data:{
                success: true,
                message: 'Business deleted successfully'
            }
            }))
        );
        await wrapper.find("button[type='button']").simulate('click');
        expect(spy).toHaveBeenCalled();
    });
});
