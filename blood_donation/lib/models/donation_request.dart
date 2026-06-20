class DonationRequest {
  final String id;
  final String patientName;
  final String bloodType;
  final String hospitalName;
  final String location;
  final String date;
  final int unitsNeeded;
  final bool isUrgent;
  final String? description;
  final String? contactNumber;

  DonationRequest({
    required this.id,
    required this.patientName,
    required this.bloodType,
    required this.hospitalName,
    required this.location,
    required this.date,
    required this.unitsNeeded,
    this.isUrgent = false,
    this.description,
    this.contactNumber,
  });

  // Factory constructor for creating from JSON
  factory DonationRequest.fromJson(Map<String, dynamic> json) {
    return DonationRequest(
      id: json['id'] as String,
      patientName: json['patientName'] as String,
      bloodType: json['bloodType'] as String,
      hospitalName: json['hospitalName'] as String,
      location: json['location'] as String,
      date: json['date'] as String,
      unitsNeeded: json['unitsNeeded'] as int,
      isUrgent: json['isUrgent'] as bool? ?? false,
      description: json['description'] as String?,
      contactNumber: json['contactNumber'] as String?,
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patientName': patientName,
      'bloodType': bloodType,
      'hospitalName': hospitalName,
      'location': location,
      'date': date,
      'unitsNeeded': unitsNeeded,
      'isUrgent': isUrgent,
      'description': description,
      'contactNumber': contactNumber,
    };
  }

  // Get urgency label
  String get urgencyLabel {
    return isUrgent ? 'كل العينات' : 'عادي';
  }
}
