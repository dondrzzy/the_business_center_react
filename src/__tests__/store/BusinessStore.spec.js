import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import BusinessStore from '../../stores/BusinessStore';
import Dashboard from '../../components/Dashboard';
import { MemoryRouter } from 'react-router-dom';

describe('BusinessStore', () => {
    it('should set store message on invalid token response from server', () => {
        BusinessStore.registerBusinesses({success:false, token: false})
        expect(BusinessStore.getResponse()).toBe('You must be logged in to perform that action');
    });

    it('should set store message on invalid token response from server', () => {
        BusinessStore.updateBusinesses({res:{success:false, token: false}})
        expect(BusinessStore.getResponse()).toBe('You must be logged in to perform that action');
    });

    it('should set store message on invalid token response from server', () => {
        BusinessStore.deleteBusiness({res:{success:false, token: false}})
        expect(BusinessStore.getResponse()).toBe('You must be logged in to perform that action');
    })

    it('should set store message on invalid token response from server', () => {
        BusinessStore.addReview({res:{success:false, token: false}})
        expect(BusinessStore.getResponse()).toBe('You must be logged in to perform that action');
    })
})