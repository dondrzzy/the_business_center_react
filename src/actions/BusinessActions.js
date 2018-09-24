import axios from 'axios';
import dispatcher from '../dispatcher';
import * as urlConfig from '../utils/baseUrl';

const baseUrl = urlConfig.default.getBaseUrl();

export const getBusinesses = (searchStr) => {
  axios
    .get(`${baseUrl}businesses${searchStr}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      dispatcher.dispatch({
        type: 'LOAD_BUSINESSES',
        data: response.data,
      });
    });
};

export const getUserBusinesses = (searchStr = '') => {
  const token = localStorage.getItem('jwt') ? JSON.parse(localStorage.getItem('jwt')) : null;
  axios
    .get(`${baseUrl}users/businesses${searchStr}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then((response) => {
      dispatcher.dispatch({
        type: 'LOAD_BUSINESSES',
        data: response.data,
      });
    })
    .catch((error) => {
      if (error.response) {
        dispatcher.dispatch({
          type: 'LOAD_BUSINESSES',
          data: error.response.data,
        });
      }
    });
};

export const registerBusiness = (data) => {
  const token = localStorage.getItem('jwt') ? JSON.parse(localStorage.getItem('jwt')) : null;
  axios
    .post(`${baseUrl}businesses`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then((response) => {
      dispatcher.dispatch({
        type: 'REGISTER_BUSINESSES',
        data: response.data,
      });
    })
    .catch((error) => {
      if (error.response) {
        dispatcher.dispatch({
          type: 'REGISTER_BUSINESSES',
          data: error.response.data,
        });
      }
    });
};

export const updateBusiness = (data, id) => {
  const token = window.localStorage.getItem('jwt') ? JSON.parse(window.localStorage.getItem('jwt')) : null;
  axios
    .put(`${baseUrl}businesses/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then((response) => {
      dispatcher.dispatch({
        type: 'UPDATE_BUSINESSES',
        data: {
          id,
          res: response.data,
        },
      });
    })
    .catch((error) => {
      if (error.response) {
        dispatcher.dispatch({
          type: 'UPDATE_BUSINESSES',
          data: {
            id,
            res: error.response.data,
          },
        });
      }
    });
};
export const deleteBusiness = (id) => {
  const token = localStorage.getItem('jwt') ? JSON.parse(localStorage.getItem('jwt')) : null;
  axios
    .delete(`${baseUrl}businesses/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then((response) => {
      dispatcher.dispatch({
        type: 'DELETE_BUSINESSES',
        data: {
          id,
          res: response.data,
        },
      });
    })
    .catch((error) => {
      if (error.response) {
        dispatcher.dispatch({
          type: 'DELETE_BUSINESSES',
          data: {
            id,
            res: error.response.data,
          },
        });
      }
    });
};

export const getReviews = (id) => {
  axios
    .get(`${baseUrl}businesses/${id}/reviews`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => dispatcher.dispatch({
      type: 'GET_REVIEWS',
      data: {
        res: response.data,
        id,
      },
    }));
};
export const postReview = (id, data) => {
  const token = localStorage.getItem('jwt') ? JSON.parse(localStorage.getItem('jwt')) : null;
  axios
    .post(`${baseUrl}businesses/${id}/reviews`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then(response => dispatcher.dispatch({
      type: 'ADD_REVIEW',
      data: {
        id,
        res: response.data,
      },
    }))
    .catch((error) => {
      if (error.response) {
        dispatcher.dispatch({
          type: 'ADD_REVIEW',
          data: {
            id,
            res: error.response.data,
          },
        });
      }
    });
};
