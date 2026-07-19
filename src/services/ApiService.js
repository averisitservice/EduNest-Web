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

async function getClassSubjectsAsync(classId) {
  const config = {
    method: 'get',
    url: `/class/${classId}/subjects`,
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
async function getStudentListAsync(params = {}) {
  const query = new URLSearchParams();
  const { page, size, search, classId, sectionId, sortBy, sortDir } = params;
  if (page != null) query.append('page', page);
  if (size != null) query.append('size', size);
  if (search) query.append('search', search);
  if (classId != null) query.append('classId', classId);
  if (sectionId != null) query.append('sectionId', sectionId);
  if (sortBy) query.append('sortBy', sortBy);
  if (sortDir) query.append('sortDir', sortDir);
  const qs = query.toString();
  const config = {
    method: 'get',
    url: qs ? `/student/list?${qs}` : `/student/list`,
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

//Fee
async function getFeeStatusAsync(classId, sectionId) {
  const params = new URLSearchParams();
  if (sectionId != null) params.append('sectionId', sectionId);
  const query = params.toString();
  const config = {
    method: 'get',
    url: query ? `/fee/status/${classId}?${query}` : `/fee/status/${classId}`,
  };
  return await axios(config);
}

async function collectFeePaymentAsync(payload) {
  const config = {
    method: 'post',
    url: '/fee/payment',
    data: payload,
  };
  return await axios(config);
}

async function getFeeHistoryAsync(studentId) {
  const config = {
    method: 'get',
    url: `/fee/history/${studentId}`,
  };
  return await axios(config);
}

//Exam
async function getExamListAsync(classId) {
  const params = new URLSearchParams();
  if (classId != null) params.append('classId', classId);
  const query = params.toString();
  const config = {
    method: 'get',
    url: query ? `/exam/list?${query}` : `/exam/list`,
  };
  return await axios(config);
}

async function saveExamAsync(payload) {
  const config = {
    method: 'post',
    url: '/exam',
    data: payload,
  };
  return await axios(config);
}

async function deleteExamAsync(examId) {
  const config = {
    method: 'delete',
    url: `/exam/${examId}`,
  };
  return await axios(config);
}

async function getExamMarksEntryAsync(examId, classId, sectionId) {
  const params = new URLSearchParams();
  if (sectionId != null) params.append('sectionId', sectionId);
  const query = params.toString();
  const config = {
    method: 'get',
    url: query ? `/exam/${examId}/marks/${classId}?${query}` : `/exam/${examId}/marks/${classId}`,
  };
  return await axios(config);
}

async function saveExamMarksAsync(payload) {
  const config = {
    method: 'post',
    url: '/exam/marks',
    data: payload,
  };
  return await axios(config);
}

async function getReportCardAsync(examId, studentId) {
  const config = {
    method: 'get',
    url: `/exam/${examId}/report/${studentId}`,
  };
  return await axios(config);
}

//Announcement
async function getAnnouncementListAsync() {
  const config = {
    method: 'get',
    url: `/announcement/list`,
  };
  return await axios(config);
}

async function saveAnnouncementAsync(payload) {
  const config = {
    method: 'post',
    url: '/announcement',
    data: payload,
  };
  return await axios(config);
}

async function deleteAnnouncementAsync(announcementId) {
  const config = {
    method: 'delete',
    url: `/announcement/${announcementId}`,
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
  getClassSubjectsAsync,
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

  //Fee
  getFeeStatusAsync,
  collectFeePaymentAsync,
  getFeeHistoryAsync,

  //Exam
  getExamListAsync,
  saveExamAsync,
  deleteExamAsync,
  getExamMarksEntryAsync,
  saveExamMarksAsync,
  getReportCardAsync,

  //Announcement
  getAnnouncementListAsync,
  saveAnnouncementAsync,
  deleteAnnouncementAsync,
};
