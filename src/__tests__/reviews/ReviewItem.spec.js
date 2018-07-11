import React from 'react';
import { shallow, mount } from 'enzyme';
import ReviewItem from '../../components/reviews/ReviewItem';

describe(<ReviewItem />, () => {
    it('should return a list', () => {
        let review = {
            id: 1,
            user: 'john doe',
            text: 'Nice stuff'
        }
        let wrapper = shallow(
            <ReviewItem review={review}/>
        )
        expect(wrapper.find('li').length).toEqual(1);
    });
})
