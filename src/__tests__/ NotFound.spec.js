import React from 'react';
import { shallow} from 'enzyme';
import NotFound from '../components/NotFound';

describe(<NotFound />, () => {
    it('should display a guiding message to the user', () => {
        let wrapper = shallow(<NotFound />);
        expect(wrapper.find('h4').html()).toContain('Not found. If you manually entered the URL, please correct the URL');
    })
});;