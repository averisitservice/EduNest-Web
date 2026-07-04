import axios from 'axios';

async function loginAsync(payload) {
  const config = {
    method: 'post',
    url: '/auth/login',
    data: payload,
  };
  return await axios(config);
}

async function renewSessionAsync(payload) {
  const config = {
    method: 'post',
    url: '/auth/renew-session',
    data: payload
  };
  return await axios(config);
}

//Lookup
async function getRolesAsync() {
  const config = {
    method: 'get',
    url: `lookup/roles`,
  };
  return await axios(config);
}

async function getEmploymentTypeAsync() {
  const config = {
    method: 'get',
    url: `lookup/employmentTypes`,
  };
  return await axios(config);
}

async function getSubjectAsync() {
  const config = {
    method: 'get',
    url: `lookup/subject`,
  };
  return await axios(config);
}

async function getClassMasterAsync() {
  const config = {
    method: 'get',
    url: `lookup/classMaster`,
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

async function saveTeacherAsync(payload) {
  const config = {
    method: 'post',
    url: '/teacher',
    data: payload,
  };
  return await axios(config);
}

async function getTeacherDataByIdAsync(teacherId) {
  const config = {
    method: 'get',
    url: `/teacher/${teacherId}`,
  };
  return await axios(config);
}

async function deleteTeacherAsync(teacherId) {
  const config = {
    method: 'delete',
    url: `teacher/${teacherId}`,
  };
  return await axios(config);
}


export default {
  loginAsync,
  renewSessionAsync,

  //Lookup
  getRolesAsync,
  getEmploymentTypeAsync,
  getSubjectAsync,
  getClassMasterAsync,

  //Teacher
  getTeacherListAsync,
  saveTeacherAsync,
  getTeacherDataByIdAsync,
  deleteTeacherAsync,
};
