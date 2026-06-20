// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'تطبيق التبرع بالدم';

  @override
  String get bloodDonation => 'التبرع بالدم';

  @override
  String get cases => 'الحالات';

  @override
  String get bloodBanks => 'بنوك الدم';

  @override
  String get profile => 'الملف الشخصي';

  @override
  String get settings => 'الإعدادات';

  @override
  String get language => 'اللغة';

  @override
  String get logout => 'تسجيل الخروج';

  @override
  String get edit => 'تعديل';

  @override
  String get noData => 'لا توجد بيانات';

  @override
  String get viewAll => 'عرض الكل';

  @override
  String get donations => 'التبرعات';

  @override
  String get cancel => 'إلغاء';

  @override
  String get confirmLogout => 'هل أنت متأكد من تسجيل الخروج من التطبيق؟';

  @override
  String get units => 'وحدة';

  @override
  String get fullName => 'الاسم الكامل';

  @override
  String get selectLanguage => 'اختر اللغة';

  @override
  String get arabic => 'العربية';

  @override
  String get english => 'الإنجليزية';

  @override
  String get french => 'الفرنسية';

  @override
  String get location => 'الموقع';

  @override
  String get home => 'الرئيسية';

  @override
  String welcomeName(String name) {
    return 'مرحبا، $name';
  }

  @override
  String get dontForgetAppointment => 'لا تنسَ موعدك!';

  @override
  String atTime(String time) {
    return 'على الساعة $time';
  }

  @override
  String get noAppointment => 'لا يوجد موعد';

  @override
  String get timeToDonate => 'حان وقت التبرع!';

  @override
  String get nextDonationSoon => 'تبرعك التالي قريباً';

  @override
  String get eligibleToDonate => 'أنت مؤهل للتبرع بالدم';

  @override
  String get thanksLastDonation =>
      'شكراً لتبرعك الأخير! ستكون مؤهلاً للتبرع مرة أخرى قريباً.';

  @override
  String get whereToDonate => 'أين تتبرع؟';

  @override
  String get all => 'الكل';

  @override
  String myBloodType(String bloodType) {
    return 'فصيلتي ($bloodType)';
  }

  @override
  String get other => 'أخرى';

  @override
  String get noRequests => 'لا توجد طلبات';

  @override
  String get hospital => 'مستشفى';

  @override
  String get caseDetails => 'تفاصيل الحالة';

  @override
  String caseDetailsFor(String name) {
    return 'تفاصيل الحالة لـ $name';
  }

  @override
  String get close => 'إغلاق';

  @override
  String get togetherSaveLives => 'معاً نُنقذ الأرواح';

  @override
  String get welcomeBack => 'مرحباً بك';

  @override
  String get loginToContinue => 'سجل الدخول للمتابعة';

  @override
  String get email => 'البريد الإلكتروني';

  @override
  String get enterEmail => 'أدخل بريدك الإلكتروني';

  @override
  String get emailRequired => 'الرجاء إدخال البريد الإلكتروني';

  @override
  String get invalidEmail => 'الرجاء إدخال بريد إلكتروني صحيح';

  @override
  String get password => 'كلمة المرور';

  @override
  String get enterPassword => 'أدخل كلمة المرور';

  @override
  String get passwordRequired => 'الرجاء إدخال كلمة المرور';

  @override
  String passwordTooShort(int min) {
    return 'كلمة المرور يجب أن تكون $min أحرف على الأقل';
  }

  @override
  String get forgotPassword => 'نسيت كلمة المرور؟';

  @override
  String get login => 'تسجيل الدخول';

  @override
  String get or => 'أو';

  @override
  String get loginWithGoogle => 'تسجيل الدخول بواسطة Google';

  @override
  String get dontHaveAccount => 'ليس لديك حساب؟ ';

  @override
  String get registerNow => 'سجل الآن';

  @override
  String errorOccurred(String error) {
    return 'حدث خطأ: $error';
  }

  @override
  String get createNewAccount => 'إنشاء حساب جديد';

  @override
  String get joinUsSaveLives => 'انضم إلينا وساهم في إنقاذ الأرواح';

  @override
  String get enterFullName => 'أدخل اسمك الكامل';

  @override
  String get nameRequired => 'الرجاء إدخال الاسم';

  @override
  String nameTooShort(int min) {
    return 'الاسم يجب أن يكون $min أحرف على الأقل';
  }

  @override
  String get phoneNumber => 'رقم الهاتف';

  @override
  String get enterPhoneNumber => 'أدخل رقم هاتفك';

  @override
  String get phoneRequired => 'الرجاء إدخال رقم الهاتف';

  @override
  String get invalidPhone => 'رقم الهاتف غير صحيح';

  @override
  String get address => 'العنوان';

  @override
  String get addressRequired => 'الرجاء إدخال العنوان';

  @override
  String get enterAddress => 'أدخل عنوانك';

  @override
  String addressTooShort(int min) {
    return 'العنوان يجب أن يكون $min أحرف على الأقل';
  }

  @override
  String get birthDate => 'تاريخ الميلاد';

  @override
  String get pickBirthDate => 'اختر تاريخ ميلادك';

  @override
  String get birthDateRequired => 'الرجاء اختيار تاريخ الميلاد';

  @override
  String tooYoung(int age) {
    return 'يجب أن يكون عمرك $age عاماً على الأقل';
  }

  @override
  String get gender => 'الجنس';

  @override
  String get selectGender => 'اختر الجنس';

  @override
  String get male => 'ذكر';

  @override
  String get female => 'أنثى';

  @override
  String get genderOther => 'آخر';

  @override
  String get bloodGroup => 'فصيلة الدم';

  @override
  String get selectBloodGroup => 'اختر فصيلة دمك';

  @override
  String get bloodGroupRequired => 'الرجاء اختيار فصيلة الدم';

  @override
  String get confirmPassword => 'تأكيد كلمة المرور';

  @override
  String get reEnterPassword => 'أعد إدخال كلمة المرور';

  @override
  String get confirmPasswordRequired => 'الرجاء تأكيد كلمة المرور';

  @override
  String get passwordsDoNotMatch => 'كلمة المرور غير متطابقة';

  @override
  String get agreeToTerms => 'أوافق على ';

  @override
  String get termsAndConditions => 'الشروط والأحكام';

  @override
  String get privacyPolicy => 'سياسة الخصوصية';

  @override
  String get mustAgreeTerms => 'يجب الموافقة على الشروط والأحكام';

  @override
  String get and => ' و';

  @override
  String get notAvailable => 'غير متوفر';

  @override
  String get bloodUnitsNeeded => 'وحدات الدم المطلوبة';

  @override
  String get getDirections => 'احصل على الاتجاهات';

  @override
  String openingMapFor(String name) {
    return 'فتح الخريطة لـ $name';
  }

  @override
  String get bookAppointment => 'حجز موعد للتبرع';

  @override
  String get selectDateAndTime => 'الرجاء اختيار التاريخ والوقت';

  @override
  String get pleaseLoginFirst => 'الرجاء تسجيل الدخول أولاً';

  @override
  String get appointmentBooked => 'تم حجز الموعد بنجاح!';

  @override
  String unitsRequired(int quantity) {
    return '$quantity وحدات مطلوبة';
  }

  @override
  String get selectDate => 'اختر التاريخ';

  @override
  String get selectTime => 'اختر الوقت';

  @override
  String get notesOptional => 'ملاحظات (اختياري)';

  @override
  String get addNotesHint => 'أضف أي ملاحظات إضافية...';

  @override
  String get confirmAppointment => 'تأكيد الموعد';

  @override
  String get done => 'تم';

  @override
  String get willBeAbleToDonate => 'ستتمكن من التبرع';

  @override
  String inDays(int days) {
    return 'خلال $days أيام';
  }

  @override
  String get donatedOn => 'تم التبرع في';

  @override
  String get dataUpdatedSuccessfully => 'تم تحديث البيانات بنجاح';

  @override
  String get updateError => 'حدث خطأ أثناء التحديث';

  @override
  String get editProfile => 'تعديل الملف الشخصي';

  @override
  String get saveChanges => 'حفظ التغييرات';

  @override
  String get share => 'مشاركة';

  @override
  String get donateNow => 'تبرع الآن';

  @override
  String get urgent => 'عاجل';

  @override
  String get medium => 'متوسط';

  @override
  String get low => 'منخفض';

  @override
  String get urgentCase => 'حالة مستعجلة';

  @override
  String shareMessage(Object bloodType, Object hospital, Object id) {
    return 'تبرع بالدم للحالة: $hospital\nفصيلة الدم: $bloodType\nالمستشفى: $hospital\nرابط الحالة: blooddonation://request?id=$id';
  }

  @override
  String minutesAgo(Object count) {
    return 'منذ $count دقيقة';
  }

  @override
  String hoursAgo(Object count) {
    return 'منذ $count ساعة';
  }

  @override
  String get yesterday => 'أمس';

  @override
  String daysAgo(Object count) {
    return 'منذ $count أيام';
  }

  @override
  String get register => 'إنشاء حساب';

  @override
  String get alreadyHaveAccount => 'لديك حساب بالفعل؟ ';

  @override
  String get resetPassword => 'إعادة تعيين كلمة المرور';

  @override
  String get forgotPasswordTitle => 'هل نسيت كلمة المرور؟';

  @override
  String get forgotPasswordDesc =>
      'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.';

  @override
  String get sendLink => 'إرسال الرابط';

  @override
  String get resetInstructionsSent =>
      'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني';

  @override
  String get checkYourEmail => 'تحقق من بريدك الإلكتروني';

  @override
  String verificationEmailSent(String email) {
    return 'لقد أرسلنا رابط التحقق إلى $email. يرجى النقر على الرابط لتأكيد حسابك.';
  }

  @override
  String get verifyBeforeLogin =>
      'يجب عليك تأكيد بريدك الإلكتروني قبل تسجيل الدخول.';

  @override
  String get goToLogin => 'الذهاب لتسجيل الدخول';

  @override
  String get checkSpamFolder =>
      'إذا لم تجد الرسالة، تحقق من مجلد البريد العشوائي.';

  @override
  String get emailNotVerified =>
      'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق الوارد.';

  @override
  String get notifications => 'الإشعارات';

  @override
  String get noNotifications => 'لا توجد إشعارات';

  @override
  String get markAsRead => 'وضع كمقروء';

  @override
  String get deleteNotification => 'حذف';
}
