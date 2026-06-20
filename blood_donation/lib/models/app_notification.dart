class AppNotification {
  final int notificationId;
  final int userId;
  final String type; // alert, reminder, info
  final String? title;
  final String? message;
  final String? bloodGroup;
  final String? urgencyLevel;
  final bool isRead;
  final DateTime? readAt;
  final DateTime createdAt;

  AppNotification({
    required this.notificationId,
    required this.userId,
    required this.type,
    this.title,
    this.message,
    this.bloodGroup,
    this.urgencyLevel,
    this.isRead = false,
    this.readAt,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      notificationId: json['notificationId'] as int,
      userId: json['userId'] as int,
      type: json['type'] ?? json['notificationType'] ?? 'info',
      title: json['title'] as String?,
      message: json['message'] as String?,
      bloodGroup: json['bloodGroup'] as String?,
      urgencyLevel: json['urgencyLevel'] as String?,
      isRead: json['isRead'] as bool? ?? json['read'] as bool? ?? false,
      readAt: json['readAt'] != null
          ? DateTime.parse(json['readAt'] as String)
          : null,
      createdAt: DateTime.parse(json['createdAt'] ?? json['sentAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'notificationId': notificationId,
      'userId': userId,
      'type': type,
      'title': title,
      'message': message,
      'bloodGroup': bloodGroup,
      'urgencyLevel': urgencyLevel,
      'isRead': isRead,
      'readAt': readAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  // Display helpers
  String get displayBloodType {
    if (bloodGroup == null) return '';
    return bloodGroup!
        .replaceAll('_POS', '+')
        .replaceAll('_NEG', '-')
        .replaceAll('_', '');
  }

  bool get isAlert => type == 'alert';
  bool get isReminder => type == 'reminder';
  bool get isInfo => type == 'info';
}

/// Response from the poll endpoint
class PollNotificationsResponse {
  final bool hasNewNotifications;
  final List<AppNotification> notifications;

  PollNotificationsResponse({
    required this.hasNewNotifications,
    required this.notifications,
  });

  factory PollNotificationsResponse.fromJson(Map<String, dynamic> json) {
    return PollNotificationsResponse(
      hasNewNotifications:
          json['hasNewNotifications'] as bool? ??
          json['hasUpdates'] as bool? ??
          false,
      notifications: json['notifications'] != null
          ? (json['notifications'] as List)
                .map((n) => AppNotification.fromJson(n))
                .toList()
          : [],
    );
  }
}

/// Response from the get notifications endpoint
class NotificationsResponse {
  final List<AppNotification> notifications;
  final int unreadCount;
  final int totalCount;
  final int page;
  final int limit;
  final int totalPages;

  NotificationsResponse({
    required this.notifications,
    required this.unreadCount,
    required this.totalCount,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory NotificationsResponse.fromJson(Map<String, dynamic> json) {
    return NotificationsResponse(
      notifications: json['notifications'] != null
          ? (json['notifications'] as List)
                .map((n) => AppNotification.fromJson(n))
                .toList()
          : [],
      unreadCount: json['unreadCount'] as int? ?? 0,
      totalCount:
          json['totalCount'] as int? ??
          (json['pagination']?['total'] as int? ?? 0),
      page: json['pagination']?['page'] as int? ?? 1,
      limit: json['pagination']?['limit'] as int? ?? 20,
      totalPages: json['pagination']?['totalPages'] as int? ?? 1,
    );
  }
}
