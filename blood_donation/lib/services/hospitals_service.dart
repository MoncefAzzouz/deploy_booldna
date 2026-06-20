import 'api_service.dart';
import 'api_config.dart';
import '../models/blood_alert.dart';

class HospitalsService {
  final ApiService _apiService = ApiService();

  // Get all hospitals
  Future<List<Hospital>> getHospitals() async {
    try {
      final response = await _apiService.get(ApiConfig.hospitals);

      if (response['success'] == true && response['data'] != null) {
        final List<dynamic> hospitalsJson = response['data'] as List;
        return hospitalsJson.map((json) => Hospital.fromJson(json)).toList();
      } else {
        throw ApiException(
          response['message'] ?? 'Failed to fetch hospitals',
          400,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  // Get hospital by ID
  Future<Hospital> getHospitalById(int hospitalId) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.hospitalById, {
        'id': hospitalId,
      });

      final response = await _apiService.get(endpoint);

      if (response['success'] == true && response['data'] != null) {
        return Hospital.fromJson(response['data']);
      } else {
        throw ApiException(
          response['message'] ?? 'Failed to fetch hospital',
          400,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  // Search hospitals by name
  List<Hospital> searchByName(List<Hospital> hospitals, String query) {
    if (query.isEmpty) return hospitals;

    final lowerQuery = query.toLowerCase();
    return hospitals
        .where((hospital) => hospital.name.toLowerCase().contains(lowerQuery))
        .toList();
  }

  // Filter hospitals by city
  List<Hospital> filterByCity(List<Hospital> hospitals, String? city) {
    if (city == null || city.isEmpty) return hospitals;

    return hospitals
        .where((hospital) => hospital.city?.toLowerCase() == city.toLowerCase())
        .toList();
  }
}
