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
    data: payload,
  };
  return await axios(config);
}

//Lookup
async function getRolesAsync() {
  const config = {
    method: 'get',
    url: `/lookup/roles`,
  };
  return await axios(config);
}

async function getEmploymentTypeAsync() {
  const config = {
    method: 'get',
    url: `/lookup/employmentTypes`,
  };
  return await axios(config);
}

async function getSubjectAsync() {
  const config = {
    method: 'get',
    url: `/lookup/subject`,
  };
  return await axios(config);
}

async function getClassMasterAsync() {
  const config = {
    method: 'get',
    url: `/lookup/classMaster`,
  };
  return await axios(config);
}

async function saveSubjectAsync(payload) {
  const config = {
    method: 'post',
    url: '/lookup/subject/save',
    data: payload,
  };
  return await axios(config);
}

async function getAllClassMasterSectionsAsync() {
  const config = {
    method: 'get',
    url: `/lookup/classSection`,
  };
  return await axios(config);
}

//class
async function getClassListAsync() {
  const config = {
    method: 'get',
    url: `/class/list`,
  };
  return await axios(config);
}

async function saveClassAsync(payload) {
  const config = {
    method: 'post',
    url: '/class',
    data: payload,
  };
  return await axios(config);
}

async function getClassDataByIdAsync(classId) {
  const config = {
    method: 'get',
    url: `/class/${classId}`,
  };
  return await axios(config);
}

async function deleteClassAsync(classId) {
  const config = {
    method: 'delete',
    url: `/class/${classId}`,
  };
  return await axios(config);
}

//Teacher
async function getTeacherListAsync() {
  const config = {
    method: 'get',
    url: `/teacher/list`,
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
    url: `/teacher/${teacherId}`,
  };
  return await axios(config);
}

//Timetable
async function getWorkingDaysAsync() {
  const config = {
    method: 'get',
    url: `/timetable/working-days`,
  };
  return await axios(config);
}

async function getTimetableAsync(classId, sectionId) {
  const config = {
    method: 'get',
    url: sectionId != null ? `/timetable/${classId}/${sectionId}` : `/timetable/${classId}`,
  };
  return await axios(config);
}

async function saveTimetableCellAsync(payload) {
  const config = {
    method: 'post',
    url: '/timetable/cell',
    data: payload,
  };
  return await axios(config);
}

async function getTeacherTimetableAsync(teacherId) {
  const config = {
    method: 'get',
    url: `/timetable/teacher/${teacherId}`,
  };
  return await axios(config);
}

async function getTeachersBySubjectAsync(subjectId) {
  const config = {
    method: 'get',
    url: `/teacher/subject/${subjectId}`,
  };
  return await axios(config);
}

//Student
async function getStudentListAsync() {
  const config = {
    method: 'get',
    url: `/student/list`,
  };
  return await axios(config);
}

async function saveStudentAsync(payload) {
  const config = {
    method: 'post',
    url: '/student',
    data: payload,
  };
  return await axios(config);
}

async function getStudentDataByIdAsync(studentId) {
  const config = {
    method: 'get',
    url: `/student/${studentId}`,
  };
  return await axios(config);
}

async function deleteStudentAsync(studentId) {
  const config = {
    method: 'delete',
    url: `/student/${studentId}`,
  };
  return await axios(config);
}

//Attendance
async function getAttendanceRosterAsync(classId, sectionId, date) {
  const params = new URLSearchParams({ date });
  if (sectionId != null) params.append('sectionId', sectionId);
  const config = {
    method: 'get',
    url: `/attendance/roster/${classId}?${params.toString()}`,
  };
  return await axios(config);
}

async function saveAttendanceAsync(payload) {
  const config = {
    method: 'post',
    url: '/attendance',
    data: payload,
  };
  return await axios(config);
}

async function getAttendanceSummaryAsync(classId, sectionId, fromDate, toDate) {
  const params = new URLSearchParams({ fromDate, toDate });
  if (sectionId != null) params.append('sectionId', sectionId);
  const config = {
    method: 'get',
    url: `/attendance/summary/${classId}?${params.toString()}`,
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
  saveSubjectAsync,
  getAllClassMasterSectionsAsync,

  //class
  getClassListAsync,
  saveClassAsync,
  getClassDataByIdAsync,
  deleteClassAsync,

  //Teacher
  getTeacherListAsync,
  saveTeacherAsync,
  getTeacherDataByIdAsync,
  deleteTeacherAsync,
  getTeachersBySubjectAsync,

  //Timetable
  getWorkingDaysAsync,
  getTimetableAsync,
  saveTimetableCellAsync,
  getTeacherTimetableAsync,

  //Student
  getStudentListAsync,
  saveStudentAsync,
  getStudentDataByIdAsync,
  deleteStudentAsync,

  //Attendance
  getAttendanceRosterAsync,
  saveAttendanceAsync,
  getAttendanceSummaryAsync,
};
