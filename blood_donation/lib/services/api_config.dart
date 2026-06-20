class ApiConfig {
  // Base URL for the API
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://bloodna.com/api/v1',
  );

  // Timeout durations
  static const Duration connectionTimeout = Duration(seconds: 60);
  static const Duration receiveTimeout = Duration(seconds: 60);

  // API Endpoints
  static const String users = '/users';
  static const String userLogin = '/users/login';
  static const String userRegister = '/users/register';
  static const String userChangePassword = '/users/:id/change-password';

  static const String alerts = '/alerts/public';
  static const String alertById = '/alerts/public/:id';
  static const String createAlert = '/alerts/admin/:adminId';

  static const String donations = '/donations';
  static const String userDonations = '/users/me/donations';
  static const String donationById = '/users/me/donations/:id';
  static const String updateDonation = '/donations/admin/:adminId';

  static const String hospitals = '/hospitals/public';
  static const String hospitalById = '/hospitals/public/:id';

  static const String health = '/health';

  // Notification endpoints
  static const String notifications = '/notifications';
  static const String notificationsPoll = '/notifications/poll';
  static const String notificationMarkRead = '/notifications/:id/read';
  static const String notificationById = '/notifications/:id';

  // Email verification
  static const String verifyEmail = '/users/verify-email';

  // Questionnaire endpoints
  static const String questionnaires = '/questionnaires';
  static const String questionnaireById = '/questionnaires/:id';
  static const String questionnaireQuestions = '/questionnaires/:id/questions';
  static const String questions = '/questions';
  static const String questionById = '/questions/:id';
  static const String questionResponses = '/donations/question-responses';
  static const String questionResponsesByDonation = '/donations/:donationId/question-responses';
  static const String questionResponseById = '/question-responses/:responseId';

  // Helper method to build full URL
  static String buildUrl(String endpoint) {
    return '$baseUrl$endpoint';
  }

  // Helper method to replace path parameters
  static String replacePath(String path, Map<String, dynamic> params) {
    String result = path;
    params.forEach((key, value) {
      result = result.replaceAll(':$key', value.toString());
    });
    return result;
  }
}
