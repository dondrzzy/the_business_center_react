import React from 'react';
import { shallow, mount } from 'enzyme';
import UpdateBusiness from '../../components/businesses/UpdateBusiness';
import Businesses from '../../components/businesses/Businesses';
import * as BusinessActions from '../../actions/BusinessActions';
import axios from 'axios';

describe(<UpdateBusiness />, () => {
    let wrapper;
    let business = {
        name: 'name',
        location: 'kampala',
        category: {
            id: 1,
            status: 'Approved',
            category: 'IT'
        },
        id:1
    }
    let categoryOptions = []
    beforeEach(() => {
        wrapper = mount(
            <UpdateBusiness
                business={business}
                categoryOptions={categoryOptions}
            />
        );
    });

    afterEach( () => {
        wrapper.unmount()
    });

    it('should validate empty form fields', () => {
        expect(wrapper.state().formValidated).toBe('');
        expect(wrapper.state().nameClass).toBe('form-control');
        wrapper.find("input[name='name']").simulate('change', {target: {value: ''}});
        wrapper.find("input[name='location']").simulate('change', {target: {value: ''}});
        wrapper.find("select[name='cat']").simulate('change', {target: {value: ''}});
        wrapper.find("button[type='submit']").simulate('click');
        expect(wrapper.state().formValidated).toBe('wasValidated');
        expect(wrapper.state().nameClass).toBe('form-control is-invalid');
        expect(wrapper.find('.invalid-feedback').first().html()).toContain('This field is required');
    });

    it('should validate invalid form fields', () => {
        expect(wrapper.state().formValidated).toBe('');
        expect(wrapper.state().nameClass).toBe('form-control');
        wrapper.find("input[name='name']").simulate('change', {target: {value: '#$%^&'}});
        wrapper.find("input[name='location']").simulate('change', {target: {value: '@#$%^&*'}});
        wrapper.find("select[name='cat']").simulate('change', {target: {value: 'XDCVB'}});
        wrapper.find("button[type='submit']").simulate('click');
        expect(wrapper.state().formValidated).toBe('wasValidated');
        expect(wrapper.state().nameClass).toBe('form-control is-invalid');
        expect(wrapper.find('.invalid-feedback').first().html()).toContain('Please enter a valid business name');
    });

    it('should submit a valid form', async () => {
        const spy = jest.spyOn(BusinessActions, 'updateBusiness');
        wrapper.instance().forceUpdate()
        axios.put.mockImplementation(
            jest.fn(()=> Promise.resolve({
            data:{
                success: true,
                message: 'Business updated successfully',
                business:{
                    category: {
                        id: 2,
                        status: 'Approved',
                        category: 'Accounts'
                    },
                    id: 1,
                    name:'andela',
                    location:'Kabale',
                    user:{ 
                        name: 'john doe',
                        id: 1
                    }
                }
            }
            }))
        );
        wrapper.find("input[name='name']").simulate('change', {target: {value: 'andela'}});
        wrapper.find("input[name='location']").simulate('change', {target: {value: 'Kabale'}});
        wrapper.find("select[name='cat']").simulate('change', {target: {value: 2}});
        await wrapper.find("button[type='submit']").simulate('click');
        expect(spy).toHaveBeenCalled();
    });
})

describe('Businesses component with update business actions', () => {
    beforeEach(() => {
        window.localStorage.setItem('jwt', JSON.stringify("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsImV4cCI6MTUzMTMzMTEwN30.ONQTRwKWaMS-RD618plLzW5327VZcZ-xZ2iUzDiltqc"));
        axios.put.mockImplementationOnce(
        jest.fn(()=> Promise.reject({
            response:{
            data:{
                success: false,
                message: 'Invalid business name'
            }
            }
        }))
        );
    })

    it('should set state message when a business update action fails', () => {
        let wrapper = shallow(<Businesses />);
        BusinessActions.updateBusiness({});
        setImmediate(() => {
        expect(wrapper.state().message).toBe('Invalid business name');
        wrapper.unmount();
        window.localStorage.removeItem('jwt')
        });
    })
});
