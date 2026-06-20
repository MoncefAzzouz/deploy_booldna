import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'dart:ui';
import 'dart:io';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;

    // Initialize timezone data
    tz.initializeTimeZones();

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsIOS =
        DarwinInitializationSettings(
          requestAlertPermission: true,
          requestBadgePermission: true,
          requestSoundPermission: true,
        );

    const InitializationSettings initializationSettings =
        InitializationSettings(
          android: initializationSettingsAndroid,
          iOS: initializationSettingsIOS,
        );

    await _notificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (details) {
        // Handle notification tap
      },
    );

    // Request permissions for Android 13+
    if (Platform.isAndroid) {
      final androidImplementation = _notificationsPlugin
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >();
      if (androidImplementation != null) {
        await androidImplementation.requestNotificationsPermission();
      }
    }

    _isInitialized = true;
    print('Notification Service Initialized');
  }

  Future<void> showBookingConfirmation(
    String hospitalName,
    DateTime date,
  ) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
          'booking_channel',
          'تأكيد الموعد',
          channelDescription: 'إشعارات حجز مواعيد التبرع',
          importance: Importance.max,
          priority: Priority.high,
          color: Color(0xFFE91E63),
        );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _notificationsPlugin.show(
      0,
      'تم تأكيد موعدك! 🩸',
      'لقد قمت بحجز موعد للتبرع في $hospitalName.',
      platformDetails,
    );
  }

  Future<void> scheduleDailyReminders(
    int appointmentId,
    String hospitalName,
    DateTime appointmentDate,
  ) async {
    // Calculate the number of days until the appointment
    final now = DateTime.now();
    final difference = appointmentDate.difference(now).inDays;

    if (difference <= 0) return;

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
          'reminder_channel',
          'تذكير التبرع',
          channelDescription: 'تذكيرات يومية لموعد التبرع',
          importance: Importance.high,
          priority: Priority.high,
        );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(),
    );

    // Schedule a reminder for each day until the appointment
    for (int i = 1; i <= difference; i++) {
      final scheduledDate = now.add(Duration(days: i));
      // Set reminder time to 9:00 AM
      final reminderTime = DateTime(
        scheduledDate.year,
        scheduledDate.month,
        scheduledDate.day,
        9,
        0,
      );

      if (reminderTime.isAfter(now) && reminderTime.isBefore(appointmentDate)) {
        await _notificationsPlugin.zonedSchedule(
          appointmentId + i,
          'تذكير بالتبرع بالدم 🩸',
          'موعدك للتبرع في $hospitalName يقترب! لا تنسَ الحضور.',
          tz.TZDateTime.from(reminderTime, tz.local),
          platformDetails,
          androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
          uiLocalNotificationDateInterpretation:
              UILocalNotificationDateInterpretation.absoluteTime,
          matchDateTimeComponents: DateTimeComponents.time,
        );
      }
    }
  }

  Future<void> cancelAppointmentReminders(int appointmentId) async {
    // This is a simplified cancel logic - in a real app we might store IDs
    // For now, we cancel a range of IDs associated with the appointment
    for (int i = 0; i < 10; i++) {
      await _notificationsPlugin.cancel(appointmentId + i);
    }
  }
}
