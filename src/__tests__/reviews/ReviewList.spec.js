import React from 'react';
import { shallow, mount } from 'enzyme';
import ReviewsList from '../../components/reviews/ReviewsList';
import ReviewItem from '../../components/reviews/ReviewItem';
import { MemoryRouter } from 'react-router-dom';

describe(<ReviewsList />, () => {
    let wrapper;
    let reviews = [
        {
            id: 1,
            text: 'Nice',
            user:'john doe',
            created_at: 'wed, 04 july 2018'
        }
    ]

    it('should return no business when there are not there', ()=>{
        wrapper = shallow(
            <ReviewsList 
                postId={1}
                reviews={[]}
            />
        );
        expect(wrapper.find(ReviewItem)).toHaveLength(0);
    });

    it('should return a business items list', ()=>{
        wrapper = shallow(
            <ReviewsList 
                postId={1}
                reviews={reviews}
            />
        );
        expect(wrapper.find(ReviewItem)).toHaveLength(1);
    });
    it('should return a business items list', ()=>{
        wrapper = shallow(
            <ReviewsList 
                postId={1}
            />
        );
        expect(wrapper.find(ReviewItem)).toHaveLength(0);
    });
})
