class Donor {
  final String id;
  final String name;
  final String bloodType;
  final int totalDonations;
  final int bloodUnitsNeeded;
  final String? lastDonationDate;
  final String? profileImage;
  final String? email;
  final String? phoneNumber;

  Donor({
    required this.id,
    required this.name,
    required this.bloodType,
    required this.totalDonations,
    this.bloodUnitsNeeded = 0,
    this.lastDonationDate,
    this.profileImage,
    this.email,
    this.phoneNumber,
  });

  // Factory constructor for creating from JSON
  factory Donor.fromJson(Map<String, dynamic> json) {
    return Donor(
      id: json['id'] as String,
      name: json['name'] as String,
      bloodType: json['bloodType'] as String,
      totalDonations: json['totalDonations'] as int,
      bloodUnitsNeeded: json['bloodUnitsNeeded'] as int? ?? 0,
      lastDonationDate: json['lastDonationDate'] as String?,
      profileImage: json['profileImage'] as String?,
      email: json['email'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'bloodType': bloodType,
      'totalDonations': totalDonations,
      'bloodUnitsNeeded': bloodUnitsNeeded,
      'lastDonationDate': lastDonationDate,
      'profileImage': profileImage,
      'email': email,
      'phoneNumber': phoneNumber,
    };
  }

  // Check if donor can donate (90 days between donations)
  bool get canDonate {
    if (lastDonationDate == null) return true;
    final lastDate = DateTime.parse(lastDonationDate!);
    final daysSinceLastDonation = DateTime.now().difference(lastDate).inDays;
    return daysSinceLastDonation >= 90;
  }

  // Days until next donation
  int get daysUntilNextDonation {
    if (lastDonationDate == null) return 0;
    final lastDate = DateTime.parse(lastDonationDate!);
    final daysSinceLastDonation = DateTime.now().difference(lastDate).inDays;
    final remaining = 90 - daysSinceLastDonation;
    return remaining > 0 ? remaining : 0;
  }
}
