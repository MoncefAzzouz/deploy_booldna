import 'api_service.dart';
import 'api_config.dart';
import '../models/user.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  // Login user
  Future<AuthResponse> login(String email, String password) async {
    try {
      print('=== LOGIN DEBUG ===');
      print('URL: ${ApiConfig.baseUrl}${ApiConfig.userLogin}');
      print('Email: $email');
      print('===================');

      final response = await _apiService.post(ApiConfig.userLogin, {
        'email': email,
        'password': password,
      }, includeAuth: false);

      print('=== LOGIN RESPONSE ===');
      print('Response: $response');
      print('======================');

      if (response['success'] == true && response['data'] != null) {
        final data = response['data'];
        final user = User.fromJson(data['user'] ?? data['userWithoutPassword']);
        final token = data['token'] as String;

        // Save token and user for app reload/hot restart session restore
        await _apiService.saveToken(token);
        await _apiService.saveUser(user);

        print('=== LOGIN SUCCESS ===');
        print('User: ${user.fullName} (${user.email})');
        print('=====================');

        return AuthResponse(user: user, token: token);
      } else {
        print('=== LOGIN FAILED ===');
        print('Message: ${response['message']}');
        print('====================');
        throw ApiException(response['message'] ?? 'Login failed', 400);
      }
    } catch (e) {
      print('=== LOGIN EXCEPTION ===');
      print('Error type: ${e.runtimeType}');
      print('Error: $e');
      print('========================');
      rethrow;
    }
  }

  // Register new user - returns email for verification screen
  Future<String> register({
    required String fullName,
    required String email,
    required String password,
    required String phoneNumber,
    required String bloodGroup,
    required DateTime birthDate,
    required String gender,
    String? address,
  }) async {
    try {
      final requestData = {
        'fullName': fullName,
        'email': email,
        'password': password,
        'phoneNumber': phoneNumber,
        'address': address,
        'bloodGroup': bloodGroup,
        // Add time component to birthDate to satisfy server's datetime validation
        // Use UTC to ensure the 'Z' timezone indicator is included
        'birthDate': DateTime.utc(
          birthDate.year,
          birthDate.month,
          birthDate.day,
          0, // midnight
          0,
          0,
        ).toIso8601String(),
        'gender': gender,
      };

      // DEBUG: Log what we're sending
      print('=== REGISTRATION DEBUG ===');
      print('URL: ${ApiConfig.baseUrl}${ApiConfig.userRegister}');
      print('Request Data: $requestData');
      print('========================');

      final response = await _apiService.post(
        ApiConfig.userRegister,
        requestData,
        includeAuth: false,
      );

      // DEBUG: Log the response
      print('=== REGISTRATION RESPONSE ===');
      print('Response: $response');
      print('============================');

      if (response['success'] == true) {
        // Registration successful - user needs to verify email before login
        return email;
      } else {
        print('=== REGISTRATION FAILED ===');
        print('Message: ${response['message']}');
        print('Error: ${response['error']}');
        print('===========================');
        throw ApiException(response['message'] ?? 'Registration failed', 400);
      }
    } catch (e) {
      print('=== REGISTRATION EXCEPTION ===');
      print('Error type: ${e.runtimeType}');
      print('Error: $e');
      print('==============================');
      rethrow;
    }
  }

  // Change password
  Future<bool> changePassword({
    required int userId,
    required String currentPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.userChangePassword, {
        'id': userId,
      });

      final response = await _apiService.patch(endpoint, {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
        'confirmPassword': confirmPassword,
      });

      return response['success'] == true;
    } catch (e) {
      rethrow;
    }
  }

  // Logout
  Future<void> logout() async {
    await _apiService.deleteToken();
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _apiService.getToken();
    return token != null && token.isNotEmpty;
  }

  // Get current token
  Future<String?> getToken() async {
    return await _apiService.getToken();
  }

  // Get current stored user
  Future<User?> getStoredUser() async {
    return await _apiService.getUser();
  }
}

// Auth response model
class AuthResponse {
  final User user;
  final String token;

  AuthResponse({required this.user, required this.token});
}
