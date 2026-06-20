import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';
import 'app_localizations_fr.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
    Locale('fr'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In ar, this message translates to:
  /// **'تطبيق التبرع بالدم'**
  String get appTitle;

  /// No description provided for @bloodDonation.
  ///
  /// In ar, this message translates to:
  /// **'التبرع بالدم'**
  String get bloodDonation;

  /// No description provided for @cases.
  ///
  /// In ar, this message translates to:
  /// **'الحالات'**
  String get cases;

  /// No description provided for @bloodBanks.
  ///
  /// In ar, this message translates to:
  /// **'بنوك الدم'**
  String get bloodBanks;

  /// No description provided for @profile.
  ///
  /// In ar, this message translates to:
  /// **'الملف الشخصي'**
  String get profile;

  /// No description provided for @settings.
  ///
  /// In ar, this message translates to:
  /// **'الإعدادات'**
  String get settings;

  /// No description provided for @language.
  ///
  /// In ar, this message translates to:
  /// **'اللغة'**
  String get language;

  /// No description provided for @logout.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الخروج'**
  String get logout;

  /// No description provided for @edit.
  ///
  /// In ar, this message translates to:
  /// **'تعديل'**
  String get edit;

  /// No description provided for @noData.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد بيانات'**
  String get noData;

  /// No description provided for @viewAll.
  ///
  /// In ar, this message translates to:
  /// **'عرض الكل'**
  String get viewAll;

  /// No description provided for @donations.
  ///
  /// In ar, this message translates to:
  /// **'التبرعات'**
  String get donations;

  /// No description provided for @cancel.
  ///
  /// In ar, this message translates to:
  /// **'إلغاء'**
  String get cancel;

  /// No description provided for @confirmLogout.
  ///
  /// In ar, this message translates to:
  /// **'هل أنت متأكد من تسجيل الخروج من التطبيق؟'**
  String get confirmLogout;

  /// No description provided for @units.
  ///
  /// In ar, this message translates to:
  /// **'وحدة'**
  String get units;

  /// No description provided for @fullName.
  ///
  /// In ar, this message translates to:
  /// **'الاسم الكامل'**
  String get fullName;

  /// No description provided for @selectLanguage.
  ///
  /// In ar, this message translates to:
  /// **'اختر اللغة'**
  String get selectLanguage;

  /// No description provided for @arabic.
  ///
  /// In ar, this message translates to:
  /// **'العربية'**
  String get arabic;

  /// No description provided for @english.
  ///
  /// In ar, this message translates to:
  /// **'الإنجليزية'**
  String get english;

  /// No description provided for @french.
  ///
  /// In ar, this message translates to:
  /// **'الفرنسية'**
  String get french;

  /// No description provided for @location.
  ///
  /// In ar, this message translates to:
  /// **'الموقع'**
  String get location;

  /// No description provided for @home.
  ///
  /// In ar, this message translates to:
  /// **'الرئيسية'**
  String get home;

  /// No description provided for @welcomeName.
  ///
  /// In ar, this message translates to:
  /// **'مرحبا، {name}'**
  String welcomeName(String name);

  /// No description provided for @dontForgetAppointment.
  ///
  /// In ar, this message translates to:
  /// **'لا تنسَ موعدك!'**
  String get dontForgetAppointment;

  /// No description provided for @atTime.
  ///
  /// In ar, this message translates to:
  /// **'على الساعة {time}'**
  String atTime(String time);

  /// No description provided for @noAppointment.
  ///
  /// In ar, this message translates to:
  /// **'لا يوجد موعد'**
  String get noAppointment;

  /// No description provided for @timeToDonate.
  ///
  /// In ar, this message translates to:
  /// **'حان وقت التبرع!'**
  String get timeToDonate;

  /// No description provided for @nextDonationSoon.
  ///
  /// In ar, this message translates to:
  /// **'تبرعك التالي قريباً'**
  String get nextDonationSoon;

  /// No description provided for @eligibleToDonate.
  ///
  /// In ar, this message translates to:
  /// **'أنت مؤهل للتبرع بالدم'**
  String get eligibleToDonate;

  /// No description provided for @thanksLastDonation.
  ///
  /// In ar, this message translates to:
  /// **'شكراً لتبرعك الأخير! ستكون مؤهلاً للتبرع مرة أخرى قريباً.'**
  String get thanksLastDonation;

  /// No description provided for @whereToDonate.
  ///
  /// In ar, this message translates to:
  /// **'أين تتبرع؟'**
  String get whereToDonate;

  /// No description provided for @all.
  ///
  /// In ar, this message translates to:
  /// **'الكل'**
  String get all;

  /// No description provided for @myBloodType.
  ///
  /// In ar, this message translates to:
  /// **'فصيلتي ({bloodType})'**
  String myBloodType(String bloodType);

  /// No description provided for @other.
  ///
  /// In ar, this message translates to:
  /// **'أخرى'**
  String get other;

  /// No description provided for @noRequests.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد طلبات'**
  String get noRequests;

  /// No description provided for @hospital.
  ///
  /// In ar, this message translates to:
  /// **'مستشفى'**
  String get hospital;

  /// No description provided for @caseDetails.
  ///
  /// In ar, this message translates to:
  /// **'تفاصيل الحالة'**
  String get caseDetails;

  /// No description provided for @caseDetailsFor.
  ///
  /// In ar, this message translates to:
  /// **'تفاصيل الحالة لـ {name}'**
  String caseDetailsFor(String name);

  /// No description provided for @close.
  ///
  /// In ar, this message translates to:
  /// **'إغلاق'**
  String get close;

  /// No description provided for @togetherSaveLives.
  ///
  /// In ar, this message translates to:
  /// **'معاً نُنقذ الأرواح'**
  String get togetherSaveLives;

  /// No description provided for @welcomeBack.
  ///
  /// In ar, this message translates to:
  /// **'مرحباً بك'**
  String get welcomeBack;

  /// No description provided for @loginToContinue.
  ///
  /// In ar, this message translates to:
  /// **'سجل الدخول للمتابعة'**
  String get loginToContinue;

  /// No description provided for @email.
  ///
  /// In ar, this message translates to:
  /// **'البريد الإلكتروني'**
  String get email;

  /// No description provided for @enterEmail.
  ///
  /// In ar, this message translates to:
  /// **'أدخل بريدك الإلكتروني'**
  String get enterEmail;

  /// No description provided for @emailRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء إدخال البريد الإلكتروني'**
  String get emailRequired;

  /// No description provided for @invalidEmail.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء إدخال بريد إلكتروني صحيح'**
  String get invalidEmail;

  /// No description provided for @password.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور'**
  String get password;

  /// No description provided for @enterPassword.
  ///
  /// In ar, this message translates to:
  /// **'أدخل كلمة المرور'**
  String get enterPassword;

  /// No description provided for @passwordRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء إدخال كلمة المرور'**
  String get passwordRequired;

  /// No description provided for @passwordTooShort.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور يجب أن تكون {min} أحرف على الأقل'**
  String passwordTooShort(int min);

  /// No description provided for @forgotPassword.
  ///
  /// In ar, this message translates to:
  /// **'نسيت كلمة المرور؟'**
  String get forgotPassword;

  /// No description provided for @login.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الدخول'**
  String get login;

  /// No description provided for @or.
  ///
  /// In ar, this message translates to:
  /// **'أو'**
  String get or;

  /// No description provided for @loginWithGoogle.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الدخول بواسطة Google'**
  String get loginWithGoogle;

  /// No description provided for @dontHaveAccount.
  ///
  /// In ar, this message translates to:
  /// **'ليس لديك حساب؟ '**
  String get dontHaveAccount;

  /// No description provided for @registerNow.
  ///
  /// In ar, this message translates to:
  /// **'سجل الآن'**
  String get registerNow;

  /// No description provided for @errorOccurred.
  ///
  /// In ar, this message translates to:
  /// **'حدث خطأ: {error}'**
  String errorOccurred(String error);

  /// No description provided for @createNewAccount.
  ///
  /// In ar, this message translates to:
  /// **'إنشاء حساب جديد'**
  String get createNewAccount;

  /// No description provided for @joinUsSaveLives.
  ///
  /// In ar, this message translates to:
  /// **'انضم إلينا وساهم في إنقاذ الأرواح'**
  String get joinUsSaveLives;

  /// No description provided for @enterFullName.
  ///
  /// In ar, this message translates to:
  /// **'أدخل اسمك الكامل'**
  String get enterFullName;

  /// No description provided for @nameRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء إدخال الاسم'**
  String get nameRequired;

  /// No description provided for @nameTooShort.
  ///
  /// In ar, this message translates to:
  /// **'الاسم يجب أن يكون {min} أحرف على الأقل'**
  String nameTooShort(int min);

  /// No description provided for @phoneNumber.
  ///
  /// In ar, this message translates to:
  /// **'رقم الهاتف'**
  String get phoneNumber;

  /// No description provided for @enterPhoneNumber.
  ///
  /// In ar, this message translates to:
  /// **'أدخل رقم هاتفك'**
  String get enterPhoneNumber;

  /// No description provided for @phoneRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء إدخال رقم الهاتف'**
  String get phoneRequired;

  /// No description provided for @invalidPhone.
  ///
  /// In ar, this message translates to:
  /// **'رقم الهاتف غير صحيح'**
  String get invalidPhone;

  /// No description provided for @address.
  ///
  /// In ar, this message translates to:
  /// **'العنوان'**
  String get address;

  /// No description provided for @addressRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء إدخال العنوان'**
  String get addressRequired;

  /// No description provided for @enterAddress.
  ///
  /// In ar, this message translates to:
  /// **'أدخل عنوانك'**
  String get enterAddress;

  /// No description provided for @addressTooShort.
  ///
  /// In ar, this message translates to:
  /// **'العنوان يجب أن يكون {min} أحرف على الأقل'**
  String addressTooShort(int min);

  /// No description provided for @birthDate.
  ///
  /// In ar, this message translates to:
  /// **'تاريخ الميلاد'**
  String get birthDate;

  /// No description provided for @pickBirthDate.
  ///
  /// In ar, this message translates to:
  /// **'اختر تاريخ ميلادك'**
  String get pickBirthDate;

  /// No description provided for @birthDateRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء اختيار تاريخ الميلاد'**
  String get birthDateRequired;

  /// No description provided for @tooYoung.
  ///
  /// In ar, this message translates to:
  /// **'يجب أن يكون عمرك {age} عاماً على الأقل'**
  String tooYoung(int age);

  /// No description provided for @gender.
  ///
  /// In ar, this message translates to:
  /// **'الجنس'**
  String get gender;

  /// No description provided for @selectGender.
  ///
  /// In ar, this message translates to:
  /// **'اختر الجنس'**
  String get selectGender;

  /// No description provided for @male.
  ///
  /// In ar, this message translates to:
  /// **'ذكر'**
  String get male;

  /// No description provided for @female.
  ///
  /// In ar, this message translates to:
  /// **'أنثى'**
  String get female;

  /// No description provided for @genderOther.
  ///
  /// In ar, this message translates to:
  /// **'آخر'**
  String get genderOther;

  /// No description provided for @bloodGroup.
  ///
  /// In ar, this message translates to:
  /// **'فصيلة الدم'**
  String get bloodGroup;

  /// No description provided for @selectBloodGroup.
  ///
  /// In ar, this message translates to:
  /// **'اختر فصيلة دمك'**
  String get selectBloodGroup;

  /// No description provided for @bloodGroupRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء اختيار فصيلة الدم'**
  String get bloodGroupRequired;

  /// No description provided for @confirmPassword.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد كلمة المرور'**
  String get confirmPassword;

  /// No description provided for @reEnterPassword.
  ///
  /// In ar, this message translates to:
  /// **'أعد إدخال كلمة المرور'**
  String get reEnterPassword;

  /// No description provided for @confirmPasswordRequired.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء تأكيد كلمة المرور'**
  String get confirmPasswordRequired;

  /// No description provided for @passwordsDoNotMatch.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور غير متطابقة'**
  String get passwordsDoNotMatch;

  /// No description provided for @agreeToTerms.
  ///
  /// In ar, this message translates to:
  /// **'أوافق على '**
  String get agreeToTerms;

  /// No description provided for @termsAndConditions.
  ///
  /// In ar, this message translates to:
  /// **'الشروط والأحكام'**
  String get termsAndConditions;

  /// No description provided for @privacyPolicy.
  ///
  /// In ar, this message translates to:
  /// **'سياسة الخصوصية'**
  String get privacyPolicy;

  /// No description provided for @mustAgreeTerms.
  ///
  /// In ar, this message translates to:
  /// **'يجب الموافقة على الشروط والأحكام'**
  String get mustAgreeTerms;

  /// No description provided for @and.
  ///
  /// In ar, this message translates to:
  /// **' و'**
  String get and;

  /// No description provided for @notAvailable.
  ///
  /// In ar, this message translates to:
  /// **'غير متوفر'**
  String get notAvailable;

  /// No description provided for @bloodUnitsNeeded.
  ///
  /// In ar, this message translates to:
  /// **'وحدات الدم المطلوبة'**
  String get bloodUnitsNeeded;

  /// No description provided for @getDirections.
  ///
  /// In ar, this message translates to:
  /// **'احصل على الاتجاهات'**
  String get getDirections;

  /// No description provided for @openingMapFor.
  ///
  /// In ar, this message translates to:
  /// **'فتح الخريطة لـ {name}'**
  String openingMapFor(String name);

  /// No description provided for @bookAppointment.
  ///
  /// In ar, this message translates to:
  /// **'حجز موعد للتبرع'**
  String get bookAppointment;

  /// No description provided for @selectDateAndTime.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء اختيار التاريخ والوقت'**
  String get selectDateAndTime;

  /// No description provided for @pleaseLoginFirst.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء تسجيل الدخول أولاً'**
  String get pleaseLoginFirst;

  /// No description provided for @appointmentBooked.
  ///
  /// In ar, this message translates to:
  /// **'تم حجز الموعد بنجاح!'**
  String get appointmentBooked;

  /// No description provided for @unitsRequired.
  ///
  /// In ar, this message translates to:
  /// **'{quantity} وحدات مطلوبة'**
  String unitsRequired(int quantity);

  /// No description provided for @selectDate.
  ///
  /// In ar, this message translates to:
  /// **'اختر التاريخ'**
  String get selectDate;

  /// No description provided for @selectTime.
  ///
  /// In ar, this message translates to:
  /// **'اختر الوقت'**
  String get selectTime;

  /// No description provided for @notesOptional.
  ///
  /// In ar, this message translates to:
  /// **'ملاحظات (اختياري)'**
  String get notesOptional;

  /// No description provided for @addNotesHint.
  ///
  /// In ar, this message translates to:
  /// **'أضف أي ملاحظات إضافية...'**
  String get addNotesHint;

  /// No description provided for @confirmAppointment.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد الموعد'**
  String get confirmAppointment;

  /// No description provided for @done.
  ///
  /// In ar, this message translates to:
  /// **'تم'**
  String get done;

  /// No description provided for @willBeAbleToDonate.
  ///
  /// In ar, this message translates to:
  /// **'ستتمكن من التبرع'**
  String get willBeAbleToDonate;

  /// No description provided for @inDays.
  ///
  /// In ar, this message translates to:
  /// **'خلال {days} أيام'**
  String inDays(int days);

  /// No description provided for @donatedOn.
  ///
  /// In ar, this message translates to:
  /// **'تم التبرع في'**
  String get donatedOn;

  /// No description provided for @dataUpdatedSuccessfully.
  ///
  /// In ar, this message translates to:
  /// **'تم تحديث البيانات بنجاح'**
  String get dataUpdatedSuccessfully;

  /// No description provided for @updateError.
  ///
  /// In ar, this message translates to:
  /// **'حدث خطأ أثناء التحديث'**
  String get updateError;

  /// No description provided for @editProfile.
  ///
  /// In ar, this message translates to:
  /// **'تعديل الملف الشخصي'**
  String get editProfile;

  /// No description provided for @saveChanges.
  ///
  /// In ar, this message translates to:
  /// **'حفظ التغييرات'**
  String get saveChanges;

  /// No description provided for @share.
  ///
  /// In ar, this message translates to:
  /// **'مشاركة'**
  String get share;

  /// No description provided for @donateNow.
  ///
  /// In ar, this message translates to:
  /// **'تبرع الآن'**
  String get donateNow;

  /// No description provided for @urgent.
  ///
  /// In ar, this message translates to:
  /// **'عاجل'**
  String get urgent;

  /// No description provided for @medium.
  ///
  /// In ar, this message translates to:
  /// **'متوسط'**
  String get medium;

  /// No description provided for @low.
  ///
  /// In ar, this message translates to:
  /// **'منخفض'**
  String get low;

  /// No description provided for @urgentCase.
  ///
  /// In ar, this message translates to:
  /// **'حالة مستعجلة'**
  String get urgentCase;

  /// No description provided for @shareMessage.
  ///
  /// In ar, this message translates to:
  /// **'تبرع بالدم للحالة: {hospital}\nفصيلة الدم: {bloodType}\nالمستشفى: {hospital}\nرابط الحالة: blooddonation://request?id={id}'**
  String shareMessage(Object bloodType, Object hospital, Object id);

  /// No description provided for @minutesAgo.
  ///
  /// In ar, this message translates to:
  /// **'منذ {count} دقيقة'**
  String minutesAgo(Object count);

  /// No description provided for @hoursAgo.
  ///
  /// In ar, this message translates to:
  /// **'منذ {count} ساعة'**
  String hoursAgo(Object count);

  /// No description provided for @yesterday.
  ///
  /// In ar, this message translates to:
  /// **'أمس'**
  String get yesterday;

  /// No description provided for @daysAgo.
  ///
  /// In ar, this message translates to:
  /// **'منذ {count} أيام'**
  String daysAgo(Object count);

  /// No description provided for @register.
  ///
  /// In ar, this message translates to:
  /// **'إنشاء حساب'**
  String get register;

  /// No description provided for @alreadyHaveAccount.
  ///
  /// In ar, this message translates to:
  /// **'لديك حساب بالفعل؟ '**
  String get alreadyHaveAccount;

  /// No description provided for @resetPassword.
  ///
  /// In ar, this message translates to:
  /// **'إعادة تعيين كلمة المرور'**
  String get resetPassword;

  /// No description provided for @forgotPasswordTitle.
  ///
  /// In ar, this message translates to:
  /// **'هل نسيت كلمة المرور؟'**
  String get forgotPasswordTitle;

  /// No description provided for @forgotPasswordDesc.
  ///
  /// In ar, this message translates to:
  /// **'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.'**
  String get forgotPasswordDesc;

  /// No description provided for @sendLink.
  ///
  /// In ar, this message translates to:
  /// **'إرسال الرابط'**
  String get sendLink;

  /// No description provided for @resetInstructionsSent.
  ///
  /// In ar, this message translates to:
  /// **'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'**
  String get resetInstructionsSent;

  /// No description provided for @checkYourEmail.
  ///
  /// In ar, this message translates to:
  /// **'تحقق من بريدك الإلكتروني'**
  String get checkYourEmail;

  /// No description provided for @verificationEmailSent.
  ///
  /// In ar, this message translates to:
  /// **'لقد أرسلنا رابط التحقق إلى {email}. يرجى النقر على الرابط لتأكيد حسابك.'**
  String verificationEmailSent(String email);

  /// No description provided for @verifyBeforeLogin.
  ///
  /// In ar, this message translates to:
  /// **'يجب عليك تأكيد بريدك الإلكتروني قبل تسجيل الدخول.'**
  String get verifyBeforeLogin;

  /// No description provided for @goToLogin.
  ///
  /// In ar, this message translates to:
  /// **'الذهاب لتسجيل الدخول'**
  String get goToLogin;

  /// No description provided for @checkSpamFolder.
  ///
  /// In ar, this message translates to:
  /// **'إذا لم تجد الرسالة، تحقق من مجلد البريد العشوائي.'**
  String get checkSpamFolder;

  /// No description provided for @emailNotVerified.
  ///
  /// In ar, this message translates to:
  /// **'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق الوارد.'**
  String get emailNotVerified;

  /// No description provided for @notifications.
  ///
  /// In ar, this message translates to:
  /// **'الإشعارات'**
  String get notifications;

  /// No description provided for @noNotifications.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد إشعارات'**
  String get noNotifications;

  /// No description provided for @markAsRead.
  ///
  /// In ar, this message translates to:
  /// **'وضع كمقروء'**
  String get markAsRead;

  /// No description provided for @deleteNotification.
  ///
  /// In ar, this message translates to:
  /// **'حذف'**
  String get deleteNotification;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en', 'fr'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
    case 'fr':
      return AppLocalizationsFr();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
