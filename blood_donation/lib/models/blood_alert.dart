import 'package:blood_donation/l10n/generated/app_localizations.dart';

class BloodAlert {
  final int alertId;
  final int? hospitalId;
  final String bloodGroup;
  final int quantityUnits;
  final String urgencyLevel; // low, medium, urgent
  final String status; // active, recovered
  final String? description;
  final int createdBy;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final DateTime? deletedAt;

  // Nested objects
  final Hospital? hospital;
  final AdminInfo? createdByAdmin;
  final List<DonationInfo>? donations;

  BloodAlert({
    required this.alertId,
    this.hospitalId,
    required this.bloodGroup,
    required this.quantityUnits,
    required this.urgencyLevel,
    required this.status,
    this.description,
    required this.createdBy,
    required this.createdAt,
    this.updatedAt,
    this.deletedAt,
    this.hospital,
    this.createdByAdmin,
    this.donations,
  });

  // Factory constructor for creating from JSON
  factory BloodAlert.fromJson(Map<String, dynamic> json) {
    return BloodAlert(
      alertId: json['alertId'] as int,
      hospitalId: json['hospitalId'] as int?,
      bloodGroup: json['bloodGroup'] as String,
      quantityUnits: json['quantityUnits'] as int,
      urgencyLevel: json['urgencyLevel'] as String,
      status: json['status'] as String,
      description: json['description'] as String?,
      createdBy: json['createdBy'] as int,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      deletedAt: json['deletedAt'] != null
          ? DateTime.parse(json['deletedAt'] as String)
          : null,
      hospital: json['hospital'] != null
          ? Hospital.fromJson(json['hospital'])
          : null,
      createdByAdmin: json['createdByAdmin'] != null
          ? AdminInfo.fromJson(json['createdByAdmin'])
          : null,
      donations: json['donations'] != null
          ? (json['donations'] as List)
                .map((d) => DonationInfo.fromJson(d))
                .toList()
          : null,
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'alertId': alertId,
      'hospitalId': hospitalId,
      'bloodGroup': bloodGroup,
      'quantityUnits': quantityUnits,
      'urgencyLevel': urgencyLevel,
      'status': status,
      'description': description,
      'createdBy': createdBy,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'deletedAt': deletedAt?.toIso8601String(),
      'hospital': hospital?.toJson(),
      'createdByAdmin': createdByAdmin?.toJson(),
      'donations': donations?.map((d) => d.toJson()).toList(),
    };
  }

  // Get display blood type (convert O_POS to O+)
  String get displayBloodType {
    return bloodGroup
        .replaceAll('_POS', '+')
        .replaceAll('_NEG', '-')
        .replaceAll('_', '');
  }

  // Check if urgent
  bool get isUrgent => urgencyLevel == 'urgent';

  // Check if active
  bool get isActive => status == 'active';

  // Get localized urgency label
  String getLocalizedUrgencyLabel(AppLocalizations l10n) {
    switch (urgencyLevel) {
      case 'urgent':
        return l10n.urgent;
      case 'medium':
        return l10n.medium;
      case 'low':
        return l10n.low;
      default:
        return urgencyLevel;
    }
  }

  @Deprecated('Use getLocalizedUrgencyLabel instead')
  String get urgencyLabel {
    switch (urgencyLevel) {
      case 'urgent':
        return 'عاجل';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return urgencyLevel;
    }
  }

  // Get localized formatted date
  String getLocalizedDate(AppLocalizations l10n) {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        return l10n.minutesAgo(difference.inMinutes);
      }
      return l10n.hoursAgo(difference.inHours);
    } else if (difference.inDays == 1) {
      return l10n.yesterday;
    } else if (difference.inDays < 7) {
      return l10n.daysAgo(difference.inDays);
    } else {
      return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
    }
  }

  @Deprecated('Use getLocalizedDate instead')
  String get formattedDate {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        return 'منذ ${difference.inMinutes} دقيقة';
      }
      return 'منذ ${difference.inHours} ساعة';
    } else if (difference.inDays == 1) {
      return 'أمس';
    } else if (difference.inDays < 7) {
      return 'منذ ${difference.inDays} أيام';
    } else {
      return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
    }
  }
}

// Hospital info nested in alert
class Hospital {
  final int hospitalId;
  final String name;
  final String? address;
  final String? city;
  final String? phone;

  Hospital({
    required this.hospitalId,
    required this.name,
    this.address,
    this.city,
    this.phone,
  });

  factory Hospital.fromJson(Map<String, dynamic> json) {
    return Hospital(
      hospitalId: json['hospitalId'] as int,
      name: json['name'] as String,
      address: json['address'] as String?,
      city: json['city'] as String?,
      phone: json['phone'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'hospitalId': hospitalId,
      'name': name,
      'address': address,
      'city': city,
      'phone': phone,
    };
  }
}

// Admin info nested in alert
class AdminInfo {
  final int adminId;
  final String fullName;

  AdminInfo({required this.adminId, required this.fullName});

  factory AdminInfo.fromJson(Map<String, dynamic> json) {
    return AdminInfo(
      adminId: json['adminId'] as int,
      fullName: json['fullName'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'adminId': adminId, 'fullName': fullName};
  }
}

// Donation info nested in alert details
class DonationInfo {
  final int donationId;
  final DateTime donationDate;
  final String status;
  final UserInfo? user;

  DonationInfo({
    required this.donationId,
    required this.donationDate,
    required this.status,
    this.user,
  });

  factory DonationInfo.fromJson(Map<String, dynamic> json) {
    return DonationInfo(
      donationId: json['donationId'] as int,
      donationDate: DateTime.parse(json['donationDate'] as String),
      status: json['status'] as String,
      user: json['user'] != null ? UserInfo.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'donationId': donationId,
      'donationDate': donationDate.toIso8601String(),
      'status': status,
      'user': user?.toJson(),
    };
  }
}

// User info nested in donation
class UserInfo {
  final String fullName;
  final String bloodGroup;

  UserInfo({required this.fullName, required this.bloodGroup});

  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      fullName: json['fullName'] as String,
      bloodGroup: json['bloodGroup'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'fullName': fullName, 'bloodGroup': bloodGroup};
  }
}
