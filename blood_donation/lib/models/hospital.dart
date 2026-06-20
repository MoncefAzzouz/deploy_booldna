class Hospital {
  final String id;
  final String name;
  final String nameArabic;
  final double latitude;
  final double longitude;
  final String address;
  final int bloodUnitsNeeded;
  final String? phoneNumber;
  final List<String>? neededBloodTypes;

  Hospital({
    required this.id,
    required this.name,
    required this.nameArabic,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.bloodUnitsNeeded,
    this.phoneNumber,
    this.neededBloodTypes,
  });

  // Factory constructor for creating from JSON
  factory Hospital.fromJson(Map<String, dynamic> json) {
    return Hospital(
      id: json['id'] as String,
      name: json['name'] as String,
      nameArabic: json['nameArabic'] as String,
      latitude: json['latitude'] as double,
      longitude: json['longitude'] as double,
      address: json['address'] as String,
      bloodUnitsNeeded: json['bloodUnitsNeeded'] as int,
      phoneNumber: json['phoneNumber'] as String?,
      neededBloodTypes: (json['neededBloodTypes'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameArabic': nameArabic,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'bloodUnitsNeeded': bloodUnitsNeeded,
      'phoneNumber': phoneNumber,
      'neededBloodTypes': neededBloodTypes,
    };
  }

  // Get distance label
  String getDistanceLabel(double distanceKm) {
    return 'Distance ${distanceKm.toStringAsFixed(1)} Km';
  }
}
