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
};
