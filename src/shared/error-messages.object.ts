export const ErrorMessages = {
  NOT_FOUND_EMPLOYEE: 'لم يتم العثور على بيانات الموظف',

  NOT_FOUND_ORDER: 'لم يتم العثور على بيانات الطلب',

  UNAUTHORIZED: 'غير مصرح لك بالوصول أو الحساب غير فعّال',

  EMPLOYEE_DATA_CONFLICT: 'البيانات غير صحيحة',

  NOT_FOUND_USER: 'لم يتم العثور على رقم الهاتف',

  ACTIVATION_CODE_CONFLICT: 'رمز التحقق غير صحيح أو منتهي الصلاحية',

  ACTIVATION_CODE_UNAUTHORIZED: 'لم يتم التحقق من رمز التفعيل',

  USER_EXISTS_CONFLICT: 'المستخدم موجود مسبقاً',

  ACTIVATION_ALREADY_SENT: 'رمز التفعيل مرسل مسبقاً',

  INTERNAL_ERROR: 'لم تنجح العملية',

  NOT_ALLOWED: 'العملية غير مصرح بها',

  COUPON_NOT_ALLOWED_FOR_THIS_PLAN:
    'غير مسموح باستخدام هذا الكوبون لهذه الخطة او المحتوى او كورس',

  DEVICE_CHANGED_MULTIPLE_TIMES:
    'تم تغيير الجهاز عدة مرات  خلال مدة  قصيرة يرجى التواصل مع الدعم الفني',
  COUPON_NOT_FOUND: '{"ar":"الكوبون غير موجود","en":"Coupon not found"}',

  COUPON_NOT_ACTIVE_YET: (date: string) =>
    `{"ar":"الكوبون سيكون فعالاً بدءاً من ${date}","en":"Coupon will be active starting from ${date}"}`,

  COUPON_EXPIRED: (date: string) =>
    `{"ar":"انتهت صلاحية الكوبون بتاريخ ${date}","en":"Coupon expired on ${date}"}`,

  COUPON_MIN_ORDER_AMOUNT: (amount: number) =>
    `{"ar":"الحد الأدنى لقيمة الطلب لتفعيل الكوبون هو ${amount}","en":"Minimum order amount to use this coupon is ${amount}"}`,

  COUPON_USAGE_LIMIT_REACHED:
    '{"ar":"تم الوصول للحد الأقصى لاستخدام الكوبون","en":"Coupon usage limit has been reached"}',

  COUPON_ALREADY_USED:
    '{"ar":"الكوبون مستخدم سابقاً","en":"Coupon has already been used"}',

  YOU_ARE_NOT_ALLOWED_TO_USE_THIS_COUPON:
    '{"ar":"غير مسموح لك باستخدام هذا الكوبون","en":"You are not allowed to use this coupon"}',

  THE_COUPON_IS_NOT_VALID_AT_THIS_STORE:
    '{"ar":"الكوبون غير صالح في هذا المتجر","en":"This coupon is not valid at this store"}',

  IMAGE_NOT_CORRECT: 'امتداد الصورة غير صحيح',

  SIZE_IMAGE: 'حجم الصورة أكبر من المسموح (10 ميغابايت)',

  PAYMENT_CODE_NOT_FOUND:
    '{"ar":"رمز الدفع غير موجود","en":"Payment code not found"}',

  PAYMENT_CODE_COURSE_ID_REQUIRED:
    '{"ar":"يجب تحديد الكورس المرتبط برمز الدفع","en":"Course ID is required for this payment code"}',

  PAYMENT_CODE_CONTENT_ID_REQUIRED:
    '{"ar":"يجب تحديد المحتوى المرتبط برمز الدفع","en":"Content ID is required for this payment code"}',

  PAYMENT_CODE_PLAN_ID_REQUIRED:
    '{"ar":"يجب تحديد الخطة المرتبطة برمز الدفع","en":"Plan ID is required for this payment code"}',

  PAYMENT_CODE_IS_NOT_FOR_THIS_COURSE:
    '{"ar":"رمز الدفع غير صالح لهذا الكورس","en":"Payment code is not valid for this course"}',

  PAYMENT_CODE_IS_NOT_FOR_THIS_CONTENT:
    '{"ar":"رمز الدفع غير صالح لهذا المحتوى","en":"Payment code is not valid for this content"}',

  PAYMENT_CODE_IS_NOT_FOR_THIS_PLAN:
    '{"ar":"رمز الدفع غير صالح لهذه الخطة","en":"Payment code is not valid for this plan"}',

  PAYMENT_CODE_HAS_NO_TARGET:
    '{"ar":"رمز الدفع غير مرتبط بكورس أو محتوى أو خطة","en":"Payment code has no target"}',

  PAYMENT_CODE_NOT_ACTIVE_YET: (date: string) =>
    `{"ar":"رمز الدفع سيكون فعالاً بدءاً من ${date}","en":"Payment code will be active starting from ${date}"}`,

  PAYMENT_CODE_EXPIRED: (date: string) =>
    `{"ar":"انتهت صلاحية رمز الدفع بتاريخ ${date}","en":"Payment code expired on ${date}"}`,

  SUBSCRIPTION_NOT_ACTIVE:
    '{"ar":"الاشتراك غير فعّال","en":"Subscription is not active"}',

  SUBSCRIPTION_EXPIRED:
    '{"ar":"انتهت صلاحية الاشتراك","en":"Subscription has expired"}',

  COURSE_ACCESS_DENIED:
    '{"ar":"لا تملك صلاحية الوصول إلى هذا الكورس","en":"You do not have access to this course"}',

  PLAN_ACCESS_DENIED:
    '{"ar":"لا تملك صلاحية الوصول إلى هذه الخطة","en":"You do not have access to this plan"}',

  CONTENT_ACCESS_DENIED:
    '{"ar":"لا تملك صلاحية الوصول إلى هذا المحتوى","en":"You do not have access to this content"}',

  PROVIDE_EXACTLY_ONE_TARGET:
    '{"ar":"يجب تحديد واحد فقط من المحتوى أو الكورس أو الخطة","en":"You must provide exactly one of content, course, or plan"}',

  CONTENT_NOT_FOUND: '{"ar":لا يوجد محتوى} , "en":"content not found"',

  COURSE_NOT_ACTIVE: '{"ar":"الكورس غير موجود" ,"en":"course not found"}',
};
