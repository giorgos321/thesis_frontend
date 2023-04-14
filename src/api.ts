import axios from 'axios';

export default axios.create({
  headers: { 'x-access-token': localStorage.getItem('token') },
});
