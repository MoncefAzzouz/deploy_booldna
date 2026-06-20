// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Blood Donation App';

  @override
  String get bloodDonation => 'Blood Donation';

  @override
  String get cases => 'Cases';

  @override
  String get bloodBanks => 'Blood Banks';

  @override
  String get profile => 'Profile';

  @override
  String get settings => 'Settings';

  @override
  String get language => 'Language';

  @override
  String get logout => 'Logout';

  @override
  String get edit => 'Edit';

  @override
  String get noData => 'No Data';

  @override
  String get viewAll => 'View All';

  @override
  String get donations => 'Donations';

  @override
  String get cancel => 'Cancel';

  @override
  String get confirmLogout => 'Are you sure you want to log out?';

  @override
  String get units => 'Unit';

  @override
  String get fullName => 'Full Name';

  @override
  String get selectLanguage => 'Select Language';

  @override
  String get arabic => 'Arabic';

  @override
  String get english => 'English';

  @override
  String get french => 'French';

  @override
  String get location => 'Location';

  @override
  String get home => 'Home';

  @override
  String welcomeName(String name) {
    return 'Hello, $name';
  }

  @override
  String get dontForgetAppointment => 'Don\'t forget your appointment!';

  @override
  String atTime(String time) {
    return 'at $time';
  }

  @override
  String get noAppointment => 'No appointment';

  @override
  String get timeToDonate => 'Time to donate!';

  @override
  String get nextDonationSoon => 'Next donation soon';

  @override
  String get eligibleToDonate => 'You are eligible to donate blood';

  @override
  String get thanksLastDonation =>
      'Thanks for your last donation! You will be eligible to donate again soon.';

  @override
  String get whereToDonate => 'Where to donate?';

  @override
  String get all => 'All';

  @override
  String myBloodType(String bloodType) {
    return 'My Type ($bloodType)';
  }

  @override
  String get other => 'Other';

  @override
  String get noRequests => 'No requests';

  @override
  String get hospital => 'Hospital';

  @override
  String get caseDetails => 'Case Details';

  @override
  String caseDetailsFor(String name) {
    return 'Case details for $name';
  }

  @override
  String get close => 'Close';

  @override
  String get togetherSaveLives => 'Together we save lives';

  @override
  String get welcomeBack => 'Welcome back';

  @override
  String get loginToContinue => 'Login to continue';

  @override
  String get email => 'Email';

  @override
  String get enterEmail => 'Enter your email';

  @override
  String get emailRequired => 'Please enter email';

  @override
  String get invalidEmail => 'Please enter a valid email';

  @override
  String get password => 'Password';

  @override
  String get enterPassword => 'Enter your password';

  @override
  String get passwordRequired => 'Please enter password';

  @override
  String passwordTooShort(int min) {
    return 'Password must be at least $min characters';
  }

  @override
  String get forgotPassword => 'Forgot password?';

  @override
  String get login => 'Login';

  @override
  String get or => 'Or';

  @override
  String get loginWithGoogle => 'Login with Google';

  @override
  String get dontHaveAccount => 'Don\'t have an account? ';

  @override
  String get registerNow => 'Register now';

  @override
  String errorOccurred(String error) {
    return 'An error occurred: $error';
  }

  @override
  String get createNewAccount => 'Create new account';

  @override
  String get joinUsSaveLives => 'Join us and help save lives';

  @override
  String get enterFullName => 'Enter your full name';

  @override
  String get nameRequired => 'Please enter name';

  @override
  String nameTooShort(int min) {
    return 'Name must be at least $min characters';
  }

  @override
  String get phoneNumber => 'Phone number';

  @override
  String get enterPhoneNumber => 'Enter your phone number';

  @override
  String get phoneRequired => 'Please enter phone number';

  @override
  String get invalidPhone => 'Invalid phone number';

  @override
  String get address => 'Address';

  @override
  String get addressRequired => 'Please enter address';

  @override
  String get enterAddress => 'Enter your address';

  @override
  String addressTooShort(int min) {
    return 'Address must be at least $min characters';
  }

  @override
  String get birthDate => 'Birth date';

  @override
  String get pickBirthDate => 'Pick your birth date';

  @override
  String get birthDateRequired => 'Please pick birth date';

  @override
  String tooYoung(int age) {
    return 'You must be at least $age years old';
  }

  @override
  String get gender => 'Gender';

  @override
  String get selectGender => 'Select gender';

  @override
  String get male => 'Male';

  @override
  String get female => 'Female';

  @override
  String get genderOther => 'Other';

  @override
  String get bloodGroup => 'Blood group';

  @override
  String get selectBloodGroup => 'Select blood group';

  @override
  String get bloodGroupRequired => 'Please select blood group';

  @override
  String get confirmPassword => 'Confirm password';

  @override
  String get reEnterPassword => 'Re-enter password';

  @override
  String get confirmPasswordRequired => 'Please confirm password';

  @override
  String get passwordsDoNotMatch => 'Passwords do not match';

  @override
  String get agreeToTerms => 'I agree to ';

  @override
  String get termsAndConditions => 'Terms and Conditions';

  @override
  String get privacyPolicy => 'Privacy Policy';

  @override
  String get mustAgreeTerms => 'You must agree to terms';

  @override
  String get and => ' and ';

  @override
  String get notAvailable => 'Not available';

  @override
  String get bloodUnitsNeeded => 'Blood units needed';

  @override
  String get getDirections => 'Get directions';

  @override
  String openingMapFor(String name) {
    return 'Opening map for $name';
  }

  @override
  String get bookAppointment => 'Book donation appointment';

  @override
  String get selectDateAndTime => 'Please select date and time';

  @override
  String get pleaseLoginFirst => 'Please login first';

  @override
  String get appointmentBooked => 'Appointment booked successfully!';

  @override
  String unitsRequired(int quantity) {
    return '$quantity units required';
  }

  @override
  String get selectDate => 'Select date';

  @override
  String get selectTime => 'Select time';

  @override
  String get notesOptional => 'Notes (Optional)';

  @override
  String get addNotesHint => 'Add any additional notes...';

  @override
  String get confirmAppointment => 'Confirm Appointment';

  @override
  String get done => 'Done';

  @override
  String get willBeAbleToDonate => 'You will be able to donate';

  @override
  String inDays(int days) {
    return 'in $days Days';
  }

  @override
  String get donatedOn => 'Donated on';

  @override
  String get dataUpdatedSuccessfully => 'Data updated successfully';

  @override
  String get updateError => 'An error occurred during update';

  @override
  String get editProfile => 'Edit Profile';

  @override
  String get saveChanges => 'Save Changes';

  @override
  String get share => 'Share';

  @override
  String get donateNow => 'Donate Now';

  @override
  String get urgent => 'Urgent';

  @override
  String get medium => 'Medium';

  @override
  String get low => 'Low';

  @override
  String get urgentCase => 'Urgent Case';

  @override
  String shareMessage(Object bloodType, Object hospital, Object id) {
    return 'Donate blood for the case: $hospital\nBlood Group: $bloodType\nHospital: $hospital\nCase link: blooddonation://request?id=$id';
  }

  @override
  String minutesAgo(Object count) {
    return '$count minutes ago';
  }

  @override
  String hoursAgo(Object count) {
    return '$count hours ago';
  }

  @override
  String get yesterday => 'Yesterday';

  @override
  String daysAgo(Object count) {
    return '$count days ago';
  }

  @override
  String get register => 'Register';

  @override
  String get alreadyHaveAccount => 'Already have an account? ';

  @override
  String get resetPassword => 'Reset Password';

  @override
  String get forgotPasswordTitle => 'Forgot your password?';

  @override
  String get forgotPasswordDesc =>
      'Enter your email and we\'ll send you a link to reset your password.';

  @override
  String get sendLink => 'Send Link';

  @override
  String get resetInstructionsSent => 'Reset instructions sent to your email';

  @override
  String get checkYourEmail => 'Check your email';

  @override
  String verificationEmailSent(String email) {
    return 'We\'ve sent a verification link to $email. Please click the link to verify your account.';
  }

  @override
  String get verifyBeforeLogin =>
      'You need to verify your email before you can log in.';

  @override
  String get goToLogin => 'Go to Login';

  @override
  String get checkSpamFolder =>
      'If you don\'t see the email, check your spam folder.';

  @override
  String get emailNotVerified =>
      'Please verify your email before logging in. Check your inbox.';

  @override
  String get notifications => 'Notifications';

  @override
  String get noNotifications => 'No notifications';

  @override
  String get markAsRead => 'Mark as read';

  @override
  String get deleteNotification => 'Delete';
}
