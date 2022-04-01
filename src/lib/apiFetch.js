import axios from 'axios';
import { store } from '../store';

const apiFetch = async (url, config) => {
  const state = store.getState();
  const {
    configuration: {
      backendURL,
    },
  } = state;

  if (backendURL) {
    const { data } = await axios.get(`${backendURL}${url}`, config);

    return data;
  }

  throw new Error('No backend URL defined.');
};

export default apiFetch;
