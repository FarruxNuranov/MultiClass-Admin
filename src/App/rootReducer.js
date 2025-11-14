import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../App/Api/Auth/authSlice";
import sciencesReducer from "./Api/Sciences/sciencesSlice";
import classesReducer from "./Api/Classes/classesSlice";
import employeesReducer from "../App/Api/Teachers/teachersSlice";
import studentsReducer from "../App/Api/Students/studentsSlice";
import parentsReducer from "../App/Api/Parents/parentsSlice";
import topicsReducer from "../App/Api/Topics/topicsSlice";
import homeworkReducer from "../App/Api/homework/homeworkSlice";
import newsReducer from "../App/Api/News/newsSlice";
import attendanceReducer from "../App/Api/Attendance/attendanceSlice";
import assignmentsReducer from "../App/Api/assignments/assignmentsSlice";
import schedulesReducer from "../App/Api/Schedules/schedulesSlice";
import lessonPlansReducer from "../App/Api/LessonPlans/lessonPlansSlice";
import studentScheduleReducer from "./Api/Schedules/studentScheduleSlice";
import teacherScheduleReducer from "../App/Api/Schedules/teacherScheduleSlice";
import getMeReducer from "../App/Api/Auth/getMeSlice";
import branchesReducer from "./Api/Branches/branchesSlice";
import rolesReducer from "./Api/Roles/rolesSlice";
import smsTemplatesReducer from "./Api/Sms/smsSlice";
import transactionReducer from "./Api/transactions/transactionsSlice";
import currencyReducer from "./Api/currency/currencySlice";
import tariffReducer from "./Api/Tariffs/tariffsSlice";
import dashboardReducer from "./Api/dashboard/dashboardSlice";
import tuitionReducer from "./Api/tuitionDay/tuitionDaySlice"

const rootReducer = combineReducers({
  auth: authReducer,
  getMe: getMeReducer,
  sciences: sciencesReducer,
  classes: classesReducer,
  employees: employeesReducer,
  students: studentsReducer,
  parents: parentsReducer,
  topics: topicsReducer,
  homework: homeworkReducer,
  news: newsReducer,
  attendance: attendanceReducer,
  assignments: assignmentsReducer,
  schedules: schedulesReducer,
  studentSchedule: studentScheduleReducer,
  teacherSchedule: teacherScheduleReducer,
  lessonPlans: lessonPlansReducer,
  branches:branchesReducer,
  roles:rolesReducer,
  smsTemplates:smsTemplatesReducer,
  transaction:transactionReducer,
  currency:currencyReducer,
  tariff:tariffReducer,
  dashboard:dashboardReducer,
  tuition:tuitionReducer,
  
});
export default rootReducer;
