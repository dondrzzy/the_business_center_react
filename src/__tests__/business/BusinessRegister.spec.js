import React from 'react';
import { shallow, mount } from 'enzyme';
import BusinessRegister from '../../components/businesses/BusinessRegister';
import Businesses from '../../components/businesses/Businesses';
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

    it("should call handleBusinessRegister on form submit", () => {
        let spy = jest.spyOn(wrapper.instance(), 'handleBusinessRegister');
        wrapper.instance().forceUpdate()
        wrapper.find("input[name='name']")
          .simulate('change', {target: {value: 'andela'}});
        wrapper.find("input[name='location']")
          .simulate('change', {target: {value: 'kampala'}});
        wrapper.find("select[name='category']")
          .simulate('change', {target: {value: '1'}});
        wrapper.find('#submitBtn').simulate('click', {preventDefault: () => {}})
        expect(spy).toHaveBeenCalled();
    });
});

describe('Businesses component with register actions', () => {
  let wrapper;
  beforeEach(() => {
      axios.post.mockImplementationOnce(
      jest.fn(()=> Promise.reject({
          response:{
          data:{
              success: false,
              message: 'Invalid business name'
          }
          }
      }))
      );
      wrapper = shallow(<Businesses />);
  })
  afterEach(() => {
    setImmediate(()=>wrapper.unmount())
  })

  it('should set state message when a business register action fails', async () => {
      
      await BusinessActions.registerBusiness({});
      setImmediate(() => {
        expect(wrapper.state().message).toBe('Invalid business name');
      });
  })
});
