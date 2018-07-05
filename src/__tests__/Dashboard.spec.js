import React from 'react';
import { MemoryRouter, Redirect } from 'react-router-dom'
import { shallow, mount } from 'enzyme';
import Dashboard from '../components/Dashboard';
import BusinessList from '../components/businesses/BusinessList';
import BusinessRegister from '../components/businesses/BusinessRegister';
import * as BusinessActions from '../actions/BusinessActions';
import axios from 'axios';

describe(<Dashboard />, () => {
    let wrapper,
        component;
    beforeEach(() => {
      wrapper =  shallow(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
      )
      component = wrapper.find(Dashboard).dive()
      component.setState({
        decodedId:1,
        fetching:false,
        businessWrap : {
          businesses:[
            {
              'id':1,
              'name': 'name',
              'category':{
                'category': 'IT',
                'status': 'Approved',
                'id': 1
              },
              'location': 'location',
              'user':{ 
                'name': 'john doe',
                'id': 1
              }
            },
          ],
          next_page:3,
          prev_page:1,
          total: 1,
        user: 'john doe',
        categories: [{"id": 1, "category": "category", "status":"Approved"}]
        }
      })
    })
  
    afterEach( () => {
      wrapper.unmount();
    });
  
    it('should load load a business list', () => {
      expect(component.find(BusinessList)).toHaveLength(1)
    });

    it("should redirect unauthorized user to logout", () => {
      component.setState({redirect: true});
      expect(component.find(Redirect)).toHaveLength(1);
    });

    it("should change limit", () => {
      expect(component.state().params.limit).toEqual(5);
      component.find('#limit').simulate('change', {target: {value: 10}});
      expect(component.state().params.limit).toEqual(10);
    })

    it("should paginate next", () => {
      expect(component.state().params.page).toEqual(1);
      component.find('#next').simulate('click');
      expect(component.state().params.page).toEqual(3);
    });

    it("should paginate prev", () => {
      component.setState({
        params:{
          limit:1,
          page:2
        }
      })
      expect(component.state().params.page).toEqual(2);
      component.find('#prev').simulate('click');
      expect(component.state().params.page).toEqual(1);
    });
  
    it('should delete a business on delete', async () => {
      axios.delete.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{
            success:true,
            message:'Deleted successfully'
          }
        }))
      )

      expect(component.state().businessWrap.businesses.length).toEqual(1)
      component.find(Dashboard);
      await BusinessActions.deleteBusiness(1);
      expect(component.state().businessWrap.businesses.length).toEqual(0);
    });

    it('should redirect unauthorized', async () => {
      axios.get.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{
            success:false,
            token: false,
            message:'Invalid token'
          }
        }))
      )
      component.find(Dashboard);
      expect(component.state().redirect).toBeFalsy();
      await BusinessActions.getUserBusinesses('');
      expect(component.state().redirect).toBeTruthy();
    });

    it('should reload businesses on successful business register', async () => {
      const spy = jest.spyOn(BusinessActions, 'registerBusiness')
      axios.post.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{
            success:true,
            message:'Business registered successfully'
          }
        }))
      )
      expect(component.state().redirect).toBeFalsy();
      await BusinessActions.registerBusiness({});
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should update businesses on update', async () => {
      axios.put.mockImplementationOnce(
        jest.fn(()=> Promise.resolve({ 
          data:{
            success:true,
            message:'Updated successfully',
            business: {
              'id':1,
              'name':'andela',
              'category':{
                  'category': 'Non profit',
                  'status': 'Approved',
                  'id': '1'
              },
              'location':'Kabale',
              'user':{ 
                  'name': 'john doe',
                  'id': 1
              }
            }
          }
        }))
      )
      expect(component.state().businessWrap.businesses[0].name).toBe('name')
      component.find(Dashboard);
      let data = {
        "name": 'andela',
        "category": '2',
        "location": 'Kampala'
      }
      await BusinessActions.updateBusiness(data, 1);
      expect(component.state().businessWrap.businesses[0].name).toBe('andela')
      component.unmount()
    });

    it('should load gif on fetching businesses', () => {
      component.setState({fetching: true})
      expect(component.find('#img-loader')).toHaveLength(1);
      component.unmount()
  });
})
