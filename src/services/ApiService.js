import axios from 'axios';

async function loginAsync(payload) {
  const config = {
    method: 'post',
    url: '/auth/login',
    data: payload,
  };
  return await axios(config);
}

//Teacher
async function getTeacherListAsync() {
  const config = {
    method: 'get',
    url: `teacher/list`,
  };
  return await axios(config);
}


export default {
  loginAsync,

  //Teacher
  getTeacherListAsync
};
