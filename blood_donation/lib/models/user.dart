class User {
  final int userId;
  final String fullName;
  final String email;
  final String phoneNumber;
  final String? address;
  final String bloodGroup;
  final DateTime birthDate;
  final String gender;
  final bool? isVerified;
  final DateTime? emailVerifiedAt;
  final DateTime? lastDonationDate;
  final bool? isRegularDonor;
  final DateTime? lastLoginAt;
  final DateTime createdAt;
  final DateTime? updatedAt;

  User({
    required this.userId,
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    this.address,
    required this.bloodGroup,
    required this.birthDate,
    required this.gender,
    this.isVerified,
    this.emailVerifiedAt,
    this.lastDonationDate,
    this.isRegularDonor,
    this.lastLoginAt,
    required this.createdAt,
    this.updatedAt,
  });

  // Factory constructor for creating from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'] as int,
      fullName: json['fullName'] as String,
      email: json['email'] as String,
      phoneNumber: json['phoneNumber'] as String,
      address: json['address'] as String?,
      bloodGroup: json['bloodGroup'] as String,
      birthDate: DateTime.parse(json['birthDate'] as String),
      gender: json['gender'] as String,
      isVerified: json['isVerified'] as bool?,
      emailVerifiedAt: json['emailVerifiedAt'] != null
          ? DateTime.parse(json['emailVerifiedAt'] as String)
          : null,
      lastDonationDate: json['lastDonationDate'] != null
          ? DateTime.parse(json['lastDonationDate'] as String)
          : null,
      isRegularDonor: json['isRegularDonor'] as bool?,
      lastLoginAt: json['lastLoginAt'] != null
          ? DateTime.parse(json['lastLoginAt'] as String)
          : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'fullName': fullName,
      'email': email,
      'phoneNumber': phoneNumber,
      'address': address,
      'bloodGroup': bloodGroup,
      'birthDate': birthDate.toIso8601String(),
      'gender': gender,
      'isVerified': isVerified,
      'emailVerifiedAt': emailVerifiedAt?.toIso8601String(),
      'lastDonationDate': lastDonationDate?.toIso8601String(),
      'isRegularDonor': isRegularDonor,
      'lastLoginAt': lastLoginAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  // Get display blood type (convert O_POS to O+)
  String get displayBloodType {
    return bloodGroup
        .replaceAll('_POS', '+')
        .replaceAll('_NEG', '-')
        .replaceAll('_', '');
  }

  // Get age from birth date
  int get age {
    final now = DateTime.now();
    int age = now.year - birthDate.year;
    if (now.month < birthDate.month ||
        (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }
    return age;
  }

  // Convert display blood type to API format (O+ to O_POS)
  static String toApiBloodGroup(String displayType) {
    if (displayType.endsWith('+')) {
      return '${displayType.substring(0, displayType.length - 1)}_POS';
    } else if (displayType.endsWith('-')) {
      return '${displayType.substring(0, displayType.length - 1)}_NEG';
    }
    return displayType;
  }
}
