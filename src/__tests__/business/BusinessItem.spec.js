import React from 'react';
import { shallow, mount } from 'enzyme';
import BusinessItem from '../../components/businesses/BusinessItem';
import ReviewsList from '../../components/reviews/ReviewsList';
import Businesses from '../../components/businesses/Businesses';
import * as BusinessActions from '../../actions/BusinessActions';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

describe(<BusinessItem />, () => {
    let wrapper,
        shallowWrapper,
        component;
    let props = {
        business: {
            'id': 1,
            'name': 'name',
            'category': 'category',
            'location': 'location',
            'user':{ 
                'name': 'john doe',
                'id': 1
            }
        },
        bg: true
    }
    beforeEach(() => {
        axios.get.mockImplementation(
            jest.fn(()=> Promise.resolve({
                data:{
                success:true,
                businesses:[],
                next_page:2,
                prev_page: 1
                }
            }))
        )
        axios.post.mockImplementation(
            jest.fn(()=> Promise.resolve({
                data:{
                success:true,
                message:'Review posted successfully'
                }
            }))
        )
        shallowWrapper = shallow(
            <MemoryRouter>
                <BusinessItem business={props.business} bg={props.bg}/>
            </MemoryRouter>
            );
        component = shallowWrapper.find(BusinessItem);
    });

    afterEach( () => {
        shallowWrapper.unmount()
    });

    it('should show post review form on click', () => {
        let component = shallowWrapper.find(BusinessItem).dive();
        component.setState({
            isLoggedIn: true
        });
        let postButton = component.find('button.lc');
        expect(component.find('textarea').length).toEqual(0)
        postButton.simulate('click')
        expect(component.find('textarea').length).toEqual(1)
    });
    it('should hide post review form on cancel click', () => {
        let component = shallowWrapper.find(BusinessItem).dive();
        component.setState({formMounted: true})
        let cancelButton = component.find('#cancelBtn');
        expect(component.find('textarea').length).toEqual(1)
        cancelButton.simulate('click');
        expect(component.find('textarea').length).toEqual(0)
    });
    it('should call postReview action', async () => {
        const spy = jest.spyOn(BusinessActions, 'postReview');
        let component = shallowWrapper.find(BusinessItem).dive();
        component.setState({formMounted: true});
        component.find('textarea').simulate('change', {target: {value: 'great service'}});
        await component.find('#postBtn').simulate('click');
        expect(spy).toHaveBeenCalled();
    });
    it('should not submit empty fields', () => {
        let component = shallowWrapper.find(BusinessItem).dive();
        component.setState({formMounted: true});
        component.find('#postBtn').simulate('click');
        expect(component.find('.is-invalid')).toHaveLength(1)
    });
    it('should not submit invalid fields', () => {
        let component = shallowWrapper.find(BusinessItem).dive();
        component.setState({formMounted: true});
        component.find('textarea').simulate('change', {target: {value: '!#$%^&*())'}});
        component.find('#postBtn').simulate('click');
        expect(component.find('.invalid-feedback')).toHaveLength(1)
    });
    it('should load review items', async () => {
        component = shallowWrapper.find(BusinessItem).dive();
        expect(component.find(ReviewsList)).toHaveLength(0);
        component.setState({
            reviews : [{
                id: 1,
                user: 'john doe',
                text: 'Nice stuff'
            }]
        })
        expect(component.find('ReviewsList')).toHaveLength(1);
    })
})

describe('Businesses component on post review reject', () => {
    beforeEach(() => {
      axios.post.mockImplementationOnce(
        jest.fn(()=> Promise.reject({
          response:{
            data:{
              success: false,
              message: 'Please provide a valid review'
            }
          }
        }))
      );
    });
  
    it('should set toast message in state on post review server error', () => {
      let wrapper = shallow(<Businesses />);
      BusinessActions.postReview({});
      setImmediate(() => {
        expect(wrapper.state().message).toBe('Please provide a valid review');
        wrapper.unmount();
      });
    });
  });