import React from 'react';
import { shallow, mount } from 'enzyme';
import BusinessRegister from '../../components/businesses/BusinessRegister';
import * as BusinessActions from '../../actions/BusinessActions';
import axios from 'axios';

describe(<BusinessRegister />, () => {
    let wrapper,
        component;
    beforeEach(() => {
      axios.post.mockImplementation(
        jest.fn(()=> Promise.resolve({
          data:{
            success:true,
            message:"Business registered successfully"
          }
        }))
      )
      wrapper =  shallow(
        <BusinessRegister />
      );
    })

    it("should validate empty business input", () => {
      wrapper.find("input[name='name']")
        .simulate('change', {target: {value: ''}});
      wrapper.find("input[name='location']")
        .simulate('change', {target: {value: ''}});
      wrapper.find("select[name='category']")
        .simulate('change', {target: {value: ''}});
      wrapper.find('#submitBtn').simulate('click', {preventDefault: () => {}})
      expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('This field is required');
      expect(wrapper.state().formValidated).toBe('wasValidated')
    });

    it("should validate invalid business input", () => {
        wrapper.find("input[name='name']")
          .simulate('change', {target: {value: '#$%^'}});
        wrapper.find("input[name='location']")
          .simulate('change', {target: {value: '@#$%'}});
        wrapper.find("select[name='category']")
          .simulate('change', {target: {value: '#$%'}});
        wrapper.find('#submitBtn').simulate('click', {preventDefault: () => {}})
        expect(wrapper.find('.feedback.invalid-feedback').first().text())
        .toContain('Please enter a valid business name');
        expect(wrapper.state().formValidated).toBe('wasValidated');
        expect(wrapper.state().nameClass).toContain('is-invalid');
        expect(wrapper.state().locationClass).toContain('is-invalid');
        expect(wrapper.state().categoryClass).toContain('is-invalid');
    });

    it("should submit valid business register form", () => {
        let spy = jest.spyOn(BusinessActions, 'registerBusiness');
        wrapper.find("input[name='name']")
          .simulate('change', {target: {value: 'andela'}});
        wrapper.find("input[name='location']")
          .simulate('change', {target: {value: 'kampala'}});
        wrapper.find("select[name='category']")
          .simulate('change', {target: {value: '1'}});
        wrapper.find('#submitBtn').simulate('click', {preventDefault: () => {}})
        expect(spy).toHaveBeenCalled();
    });

})
