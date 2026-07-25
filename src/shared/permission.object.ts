const PermissionsStore = {
  GET_EMPLOYEE: 'getEmployee',
  UPDATE_EMPLOYEE: 'updateEmployee',
  DELETE_EMPLOYEE: 'deleteEmployee',
  CREATE_EMPLOYEE: 'createEmployee',

  GET_EMPLOYEE_PERMISSION: 'getEmployeePermission',
  UPDATE_EMPLOYEE_PERMISSION: 'updateEmployeePermission',
  DELETE_EMPLOYEE_PERMISSION: 'deleteEmployeePermission',
  CREATE_EMPLOYEE_PERMISSION: 'createEmployeePermission',

  GET_NOTIFICATION: 'getNotification',
  UPDATE_NOTIFICATION: 'updateNotification',
  DELETE_NOTIFICATION: 'deleteNotification',
  CREATE_NOTIFICATION: 'createNotification',

  GET_CITY: 'getCity',
  UPDATE_CITY: 'updateCity',
  DELETE_CITY: 'deleteCity',
  CREATE_CITY: 'createCity',

  GET_PERMISSION: 'getPermission',
  UPDATE_PERMISSION: 'updatePermission',
  DELETE_PERMISSION: 'deletePermission',
  CREATE_PERMISSION: 'createPermission',

  GET_ANSWER: 'getAnswer',
  UPDATE_ANSWER: 'updateAnswer',
  DELETE_ANSWER: 'deleteAnswer',
  CREATE_ANSWER: 'createAnswer',

  GET_CONTENT: 'getContent',
  UPDATE_CONTENT: 'updateContent',
  DELETE_CONTENT: 'deleteContent',
  CREATE_CONTENT: 'createContent',

  GET_COUPON: 'getCoupon',
  UPDATE_COUPON: 'updateCoupon',
  DELETE_COUPON: 'deleteCoupon',
  CREATE_COUPON: 'createCoupon',

  GET_COURSE: 'getCourse',
  UPDATE_COURSE: 'updateCourse',
  DELETE_COURSE: 'deleteCourse',
  CREATE_COURSE: 'createCourse',

  GET_DISCUSSION: 'getDiscussion',
  UPDATE_DISCUSSION: 'updateDiscussion',
  DELETE_DISCUSSION: 'deleteDiscussion',
  CREATE_DISCUSSION: 'createDiscussion',

  GET_EXAM: 'getExam',
  UPDATE_EXAM: 'updateExam',
  DELETE_EXAM: 'deleteExam',
  CREATE_EXAM: 'createExam',

  GET_LEVEL: 'getLevel',
  UPDATE_LEVEL: 'updateLevel',
  DELETE_LEVEL: 'deleteLevel',
  CREATE_LEVEL: 'createLevel',

  GET_LOGIN_HISTORY: 'getLoginHistory',
  UPDATE_LOGIN_HISTORY: 'updateLoginHistory',
  DELETE_LOGIN_HISTORY: 'deleteLoginHistory',
  CREATE_LOGIN_HISTORY: 'createLoginHistory',

  GET_PAYMENT: 'getPayment',
  UPDATE_PAYMENT: 'updatePayment',
  DELETE_PAYMENT: 'deletePayment',
  CREATE_PAYMENT: 'createPayment',

  GET_SCHEDULED_NOTIFICATION: 'getScheduledNotification',
  UPDATE_SCHEDULED_NOTIFICATION: 'updateScheduledNotification',
  DELETE_SCHEDULED_NOTIFICATION: 'deleteScheduledNotification',
  CREATE_SCHEDULED_NOTIFICATION: 'createScheduledNotification',

  GET_ANSWER_USER: 'getAnswerUser',
  UPDATE_ANSWER_USER: 'updateAnswerUser',
  DELETE_ANSWER_USER: 'deleteAnswerUser',
  CREATE_ANSWER_USER: 'createAnswerUser',

  GET_USER_COUPON: 'getUserCoupon',
  UPDATE_USER_COUPON: 'updateUserCoupon',
  DELETE_USER_COUPON: 'deleteUserCoupon',
  CREATE_USER_COUPON: 'createUserCoupon',

  GET_EXAM_USER: 'getExamUser',
  UPDATE_EXAM_USER: 'updateExamUser',
  DELETE_EXAM_USER: 'deleteExamUser',
  CREATE_EXAM_USER: 'createExamUser',

  GET_PLAN: 'getPlan',
  UPDATE_PLAN: 'updatePlan',
  DELETE_PLAN: 'deletePlan',
  CREATE_PLAN: 'createPlan',

  GET_PLAN_COUPON: 'getPlanCoupon',
  UPDATE_PLAN_COUPON: 'updatePlanCoupon',
  DELETE_PLAN_COUPON: 'deletePlanCoupon',
  CREATE_PLAN_COUPON: 'createPlanCoupon',

  GET_PLAN_COURSE: 'getPlanCourse',
  UPDATE_PLAN_COURSE: 'updatePlanCourse',
  DELETE_PLAN_COURSE: 'deletePlanCourse',
  CREATE_PLAN_COURSE: 'createPlanCourse',

  GET_QUESTION: 'getQuestion',
  UPDATE_QUESTION: 'updateQuestion',
  DELETE_QUESTION: 'deleteQuestion',
  CREATE_QUESTION: 'createQuestion',

  GET_REVIEW: 'getReview',
  UPDATE_REVIEW: 'updateReview',
  DELETE_REVIEW: 'deleteReview',
  CREATE_REVIEW: 'createReview',

  GET_STORY: 'getStory',
  UPDATE_STORY: 'updateStory',
  DELETE_STORY: 'deleteStory',
  CREATE_STORY: 'createStory',

  GET_SUBSCRIPTION: 'getSubscription',
  UPDATE_SUBSCRIPTION: 'updateSubscription',
  DELETE_SUBSCRIPTION: 'deleteSubscription',
  CREATE_SUBSCRIPTION: 'createSubscription',

  GET_TEACHER: 'getTeacher',
  UPDATE_TEACHER: 'updateTeacher',
  DELETE_TEACHER: 'deleteTeacher',
  CREATE_TEACHER: 'createTeacher',

  GET_TEACHER_VOUCHER: 'getTeacherVoucher',
  UPDATE_TEACHER_VOUCHER: 'updateTeacherVoucher',
  DELETE_TEACHER_VOUCHER: 'deleteTeacherVoucher',
  CREATE_TEACHER_VOUCHER: 'createTeacherVoucher',

  GET_USER: 'getUser',
  UPDATE_USER: 'updateUser',
  DELETE_USER: 'deleteUser',
  CREATE_USER: 'createUser',

  GET_VENDOR: 'getVendor',
  UPDATE_VENDOR: 'updateVendor',
  DELETE_VENDOR: 'deleteVendor',
  CREATE_VENDOR: 'createVendor',

  GET_VENDOR_LEVEL: 'getVendorLevel',
  UPDATE_VENDOR_LEVEL: 'updateVendorLevel',
  DELETE_VENDOR_LEVEL: 'deleteVendorLevel',
  CREATE_VENDOR_LEVEL: 'createVendorLevel',
} as const;

type PermissionKey = keyof typeof PermissionsStore;
type PermissionValue = (typeof PermissionsStore)[PermissionKey];

export { PermissionsStore, PermissionKey, PermissionValue };
