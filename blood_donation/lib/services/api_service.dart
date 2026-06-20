import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_config.dart';
import '../models/user.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final _storage = const FlutterSecureStorage();
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'auth_user';

  // Get stored token
  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  // Save token
  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  // Save current user
  Future<void> saveUser(User user) async {
    await _storage.write(key: _userKey, value: json.encode(user.toJson()));
  }

  // Get stored user
  Future<User?> getUser() async {
    final userJson = await _storage.read(key: _userKey);
    if (userJson == null || userJson.isEmpty) return null;

    try {
      return User.fromJson(json.decode(userJson) as Map<String, dynamic>);
    } catch (_) {
      await _storage.delete(key: _userKey);
      return null;
    }
  }

  // Delete token and user
  Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
  }

  // Build headers with optional authentication
  Future<Map<String, String>> _buildHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Handle API response
  dynamic _handleResponse(http.Response response) {
    final statusCode = response.statusCode;

    // Parse response body
    dynamic body;
    try {
      body = json.decode(response.body);
    } catch (e) {
      body = {'message': response.body};
    }

    // Handle different status codes
    if (statusCode >= 200 && statusCode < 300) {
      // Success
      return body;
    } else if (statusCode == 400) {
      // Bad request - try to get detailed error message
      String errorMsg = body['message'] ?? 'Bad request';
      if (body['error'] != null) {
        errorMsg += ': ${body['error']}';
      }
      throw ApiException(errorMsg, statusCode);
    } else if (statusCode == 401) {
      // Unauthorized - token expired or invalid
      throw ApiException('Unauthorized. Please login again.', statusCode);
    } else if (statusCode == 403) {
      // Forbidden
      throw ApiException('Access forbidden.', statusCode);
    } else if (statusCode == 404) {
      // Not found
      throw ApiException('Resource not found.', statusCode);
    } else if (statusCode >= 400 && statusCode < 500) {
      // Client error
      final message = body['message'] ?? body['error'] ?? 'Request failed';
      throw ApiException(message, statusCode);
    } else if (statusCode >= 500) {
      // Server error
      throw ApiException('Server error. Please try again later.', statusCode);
    } else {
      throw ApiException('Unexpected error occurred.', statusCode);
    }
  }

  // GET request
  Future<dynamic> get(String endpoint, {bool includeAuth = true}) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final headers = await _buildHeaders(includeAuth: includeAuth);

      final response = await http
          .get(url, headers: headers)
          .timeout(ApiConfig.connectionTimeout);

      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection', 0);
    } on http.ClientException {
      throw ApiException('Connection failed', 0);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: ${e.toString()}', 0);
    }
  }

  // POST request
  Future<dynamic> post(
    String endpoint,
    dynamic body, {
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final headers = await _buildHeaders(includeAuth: includeAuth);

      final response = await http
          .post(url, headers: headers, body: json.encode(body))
          .timeout(ApiConfig.connectionTimeout);

      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection', 0);
    } on http.ClientException {
      throw ApiException('Connection failed', 0);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: ${e.toString()}', 0);
    }
  }

  // PUT request
  Future<dynamic> put(
    String endpoint,
    dynamic body, {
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final headers = await _buildHeaders(includeAuth: includeAuth);

      final response = await http
          .put(url, headers: headers, body: json.encode(body))
          .timeout(ApiConfig.connectionTimeout);

      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection', 0);
    } on http.ClientException {
      throw ApiException('Connection failed', 0);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: ${e.toString()}', 0);
    }
  }

  // PATCH request
  Future<dynamic> patch(
    String endpoint,
    dynamic body, {
    bool includeAuth = true,
  }) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final headers = await _buildHeaders(includeAuth: includeAuth);

      final response = await http
          .patch(url, headers: headers, body: json.encode(body))
          .timeout(ApiConfig.connectionTimeout);

      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection', 0);
    } on http.ClientException {
      throw ApiException('Connection failed', 0);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: ${e.toString()}', 0);
    }
  }

  // DELETE request
  Future<dynamic> delete(String endpoint, {bool includeAuth = true}) async {
    try {
      final url = Uri.parse(ApiConfig.buildUrl(endpoint));
      final headers = await _buildHeaders(includeAuth: includeAuth);

      final response = await http
          .delete(url, headers: headers)
          .timeout(ApiConfig.connectionTimeout);

      return _handleResponse(response);
    } on SocketException {
      throw ApiException('No internet connection', 0);
    } on http.ClientException {
      throw ApiException('Connection failed', 0);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Request failed: ${e.toString()}', 0);
    }
  }
}

// Custom exception for API errors
class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}
