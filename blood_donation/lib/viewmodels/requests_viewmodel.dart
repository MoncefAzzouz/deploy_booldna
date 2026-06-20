import 'package:flutter/material.dart';
import '../models/blood_alert.dart';
import '../services/blood_alerts_service.dart';

class RequestsViewModel extends ChangeNotifier {
  List<BloodAlert> _allAlerts = [];
  List<BloodAlert> _filteredAlerts = [];
  bool _isLoading = false;
  String? _errorMessage;
  String _selectedBloodType = 'الكل';
  String _selectedUrgency = 'الكل';
  String? _userBloodType; // Store user's blood type for 'Other' filter

  final BloodAlertsService _alertsService = BloodAlertsService();

  List<BloodAlert> get filteredAlerts => _filteredAlerts;
  List<BloodAlert> get allAlerts => _allAlerts;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String get selectedBloodType => _selectedBloodType;
  String get selectedUrgency => _selectedUrgency;

  RequestsViewModel() {
    loadAlerts();
  }

  Future<void> loadAlerts() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _allAlerts = await _alertsService.getAlerts();

      // Filter to only active alerts
      _allAlerts = _alertsService.getActiveAlerts(_allAlerts);

      // Sort by urgency and date
      _allAlerts = _alertsService.sortByUrgency(_allAlerts);

      _applyFilters();

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _allAlerts = [];
      _applyFilters();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshAlerts() async {
    await loadAlerts();
  }

  void filterByBloodType(String bloodType, {String? userBloodType}) {
    _selectedBloodType = bloodType;
    if (userBloodType != null) {
      _userBloodType = userBloodType;
    }
    _applyFilters();
    notifyListeners();
  }

  void filterByUrgency(String urgency) {
    _selectedUrgency = urgency;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredAlerts = List.from(_allAlerts);

    // Apply blood type filter
    if (_selectedBloodType != 'الكل') {
      if (_selectedBloodType == 'أخرى' && _userBloodType != null) {
        // Show all blood types EXCEPT user's blood type
        final userApiBloodGroup = _convertDisplayToApi(_userBloodType!);
        _filteredAlerts = _filteredAlerts.where((alert) {
          return alert.bloodGroup != userApiBloodGroup;
        }).toList();
      } else {
        // Show specific blood type
        final apiBloodGroup = _convertDisplayToApi(_selectedBloodType);
        _filteredAlerts = _alertsService.filterByBloodGroup(
          _filteredAlerts,
          apiBloodGroup,
        );
      }
    }

    // Apply urgency filter
    if (_selectedUrgency != 'الكل') {
      final apiUrgency = _convertUrgencyToApi(_selectedUrgency);
      _filteredAlerts = _alertsService.filterByUrgency(
        _filteredAlerts,
        apiUrgency,
      );
    }
  }

  // Convert display blood type to API format
  String _convertDisplayToApi(String displayType) {
    if (displayType == 'الكل') return 'الكل';

    final Map<String, String> mapping = {
      'A+': 'A_POS',
      'A-': 'A_NEG',
      'B+': 'B_POS',
      'B-': 'B_NEG',
      'AB+': 'AB_POS',
      'AB-': 'AB_NEG',
      'O+': 'O_POS',
      'O-': 'O_NEG',
    };

    return mapping[displayType] ?? displayType;
  }

  // Convert urgency display to API format
  String _convertUrgencyToApi(String displayUrgency) {
    final Map<String, String> mapping = {
      'عاجل': 'urgent',
      'متوسط': 'medium',
      'منخفض': 'low',
      'الكل': '',
    };

    return mapping[displayUrgency] ?? displayUrgency;
  }

  Future<BloodAlert?> getAlertById(int alertId) async {
    try {
      return await _alertsService.getAlertById(alertId);
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return null;
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
