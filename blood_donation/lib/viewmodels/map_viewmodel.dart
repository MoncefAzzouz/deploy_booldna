import 'package:flutter/foundation.dart';
import '../models/hospital.dart';

class MapViewModel extends ChangeNotifier {
  List<Hospital> _hospitals = [];
  bool _isLoading = false;

  List<Hospital> get hospitals => _hospitals;
  bool get isLoading => _isLoading;

  MapViewModel() {
    _loadHospitals();
  }

  Future<void> _loadHospitals() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call with mock data
    await Future.delayed(const Duration(milliseconds: 500));

    _hospitals = [
      Hospital(
        id: '1',
        name: 'CHU Saadna Abdenour De Sétif',
        nameArabic: 'مستشفى سعادنة عبد النور سطيف',
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'Setif',
        bloodUnitsNeeded: 300,
        phoneNumber: '0772901129',
        neededBloodTypes: ['O+', 'A+', 'B+'],
      ),
      Hospital(
        id: '2',
        name: 'Mustapha University Hospital Center',
        nameArabic: 'المستشفى الجامعي مصطفى باشا',
        latitude: 24.6877,
        longitude: 46.7219,
        address: 'alger',
        bloodUnitsNeeded: 150,
        phoneNumber: '0660138722',
        neededBloodTypes: ['O+', 'AB+'],
      ),
      Hospital(
        id: '3',
        name: 'CHU Lamine Debaghine',
        nameArabic: 'المستشفى الجامعي مصطفى باشا',
        latitude: 24.7500,
        longitude: 46.6900,
        address: 'oran',
        bloodUnitsNeeded: 200,
        phoneNumber: '07727212',
        neededBloodTypes: ['A+', 'B+', 'O-'],
      ),
    ];

    _isLoading = false;
    notifyListeners();
  }

  Future<void> refreshHospitals() async {
    await _loadHospitals();
  }

  @override
  void dispose() {
    super.dispose();
  }
}
