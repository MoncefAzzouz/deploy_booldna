import 'blood_alert.dart';

class Donation {
  final int donationId;
  final int userId;
  final int? alertId;
  final DateTime donationDate;
  final int quantityUnits;
  final String status; // planned, confirmed, cancelled
  final bool questionnaireCompleted;
  final String? notes;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final BloodAlert? alert;

  Donation({
    required this.donationId,
    required this.userId,
    this.alertId,
    required this.donationDate,
    required this.quantityUnits,
    required this.status,
    required this.questionnaireCompleted,
    this.notes,
    required this.createdAt,
    this.updatedAt,
    this.alert,
  });

  // Factory constructor for creating from JSON
  factory Donation.fromJson(Map<String, dynamic> json) {
    return Donation(
      donationId: json['donationId'] as int,
      userId: json['userId'] as int,
      alertId: json['alertId'] as int?,
      donationDate: DateTime.parse(json['donationDate'] as String),
      quantityUnits: json['quantityUnits'] as int,
      status: json['status'] as String,
      questionnaireCompleted: json['questionnaireCompleted'] as bool,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      alert: json['alert'] != null ? BloodAlert.fromJson(json['alert']) : null,
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'donationId': donationId,
      'userId': userId,
      'alertId': alertId,
      'donationDate': donationDate.toIso8601String(),
      'quantityUnits': quantityUnits,
      'status': status,
      'questionnaireCompleted': questionnaireCompleted,
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'alert': alert?.toJson(),
    };
  }

  // Status helpers
  bool get isPlanned => status == 'planned';
  bool get isConfirmed => status == 'confirmed';
  bool get isCancelled => status == 'cancelled';

  // Get status label in Arabic
  String get statusLabel {
    switch (status) {
      case 'planned':
        return 'مخطط';
      case 'confirmed':
        return 'مؤكد';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  }

  // Get formatted date
  String get formattedDate {
    return '${donationDate.day}/${donationDate.month}/${donationDate.year}';
  }

  // Get formatted time
  String get formattedTime {
    final hour = donationDate.hour.toString().padLeft(2, '0');
    final minute = donationDate.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}
