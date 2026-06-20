import 'api_service.dart';
import 'api_config.dart';
import '../models/app_notification.dart';

class NotificationApiService {
  final ApiService _apiService = ApiService();

  /// Get all notifications for the authenticated user
  Future<NotificationsResponse> getNotifications() async {
    try {
      final response = await _apiService.get(ApiConfig.notifications);

      if (response['success'] == true && response['data'] != null) {
        return NotificationsResponse.fromJson(response['data']);
      } else {
        throw ApiException(
          response['message'] ?? 'Failed to fetch notifications',
          400,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Long-poll for real-time notifications
  /// Connection stays open until a notification arrives or timeout
  Future<PollNotificationsResponse> pollNotifications({
    int timeoutMs = 30000,
    int? lastNotificationId,
  }) async {
    try {
      final endpoint = lastNotificationId != null
          ? '${ApiConfig.notificationsPoll}?timeout=$timeoutMs&lastNotificationId=$lastNotificationId'
          : '${ApiConfig.notificationsPoll}?timeout=$timeoutMs';
      final response = await _apiService.get(endpoint);

      if (response['success'] == true && response['data'] != null) {
        return PollNotificationsResponse.fromJson(response['data']);
      } else {
        return PollNotificationsResponse(
          hasNewNotifications: false,
          notifications: [],
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Mark a notification as read
  Future<bool> markAsRead(int notificationId) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.notificationMarkRead, {
        'id': notificationId,
      });

      final response = await _apiService.patch(endpoint, {});
      return response['success'] == true;
    } catch (e) {
      rethrow;
    }
  }

  /// Delete a notification
  Future<bool> deleteNotification(int notificationId) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.notificationById, {
        'id': notificationId,
      });

      final response = await _apiService.delete(endpoint);
      return response['success'] == true;
    } catch (e) {
      rethrow;
    }
  }
}
