import 'api_service.dart';
import 'api_config.dart';
import '../models/blood_alert.dart';

class BloodAlertsService {
  final ApiService _apiService = ApiService();

  // Get all blood alerts
  Future<List<BloodAlert>> getAlerts() async {
    try {
      final response = await _apiService.get(ApiConfig.alerts);

      if (response['success'] == true && response['data'] != null) {
        final List<dynamic> alertsJson = response['data'] as List;
        return alertsJson.map((json) => BloodAlert.fromJson(json)).toList();
      } else {
        throw ApiException(
          response['message'] ?? 'Failed to fetch alerts',
          400,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  // Get blood alert by ID
  Future<BloodAlert> getAlertById(int alertId) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.alertById, {
        'id': alertId,
      });

      final response = await _apiService.get(endpoint);

      if (response['success'] == true && response['data'] != null) {
        return BloodAlert.fromJson(response['data']);
      } else {
        throw ApiException(response['message'] ?? 'Failed to fetch alert', 400);
      }
    } catch (e) {
      rethrow;
    }
  }

  // Filter alerts by blood group
  List<BloodAlert> filterByBloodGroup(
    List<BloodAlert> alerts,
    String? bloodGroup,
  ) {
    if (bloodGroup == null || bloodGroup.isEmpty || bloodGroup == 'الكل') {
      return alerts;
    }
    return alerts.where((alert) => alert.bloodGroup == bloodGroup).toList();
  }

  // Filter alerts by urgency
  List<BloodAlert> filterByUrgency(List<BloodAlert> alerts, String? urgency) {
    if (urgency == null || urgency.isEmpty) {
      return alerts;
    }
    return alerts.where((alert) => alert.urgencyLevel == urgency).toList();
  }

  // Sort alerts by urgency (urgent first)
  List<BloodAlert> sortByUrgency(List<BloodAlert> alerts) {
    final sorted = List<BloodAlert>.from(alerts);
    sorted.sort((a, b) {
      const urgencyOrder = {'urgent': 0, 'medium': 1, 'low': 2};
      final aOrder = urgencyOrder[a.urgencyLevel] ?? 3;
      final bOrder = urgencyOrder[b.urgencyLevel] ?? 3;
      return aOrder.compareTo(bOrder);
    });
    return sorted;
  }

  // Sort alerts by date (newest first)
  List<BloodAlert> sortByDate(List<BloodAlert> alerts) {
    final sorted = List<BloodAlert>.from(alerts);
    sorted.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return sorted;
  }

  // Get active alerts only
  List<BloodAlert> getActiveAlerts(List<BloodAlert> alerts) {
    return alerts.where((alert) => alert.isActive).toList();
  }
}
