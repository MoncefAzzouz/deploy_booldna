import 'api_service.dart';
import 'api_config.dart';
import '../models/donation.dart';

class DonationsService {
  final ApiService _apiService = ApiService();

  // Create a new donation
  Future<Donation> createDonation({
    required int userId,
    required int alertId,
    required DateTime donationDate,
    required bool questionnaireCompleted,
    int? questionnaireId,
    List<Map<String, dynamic>>? questionResponses,
    String? notes,
  }) async {
    try {
      final requestData = {
        'userId': userId,
        'alertId': alertId,
        'donationDate': donationDate.toUtc().toIso8601String(),
        'questionnaireCompleted': questionnaireCompleted,
        if (questionnaireId != null) 'questionnaireId': questionnaireId,
        if (questionResponses != null && questionResponses.isNotEmpty)
          'questionResponses': questionResponses,
        if (notes != null) 'notes': notes,
      };

      print('=== CREATE DONATION DEBUG ===');
      print('URL: ${ApiConfig.baseUrl}${ApiConfig.donations}');
      print('Request Data: $requestData');
      print('=============================');

      final response = await _apiService.post(ApiConfig.donations, requestData);

      print('=== CREATE DONATION RESPONSE ===');
      print('Response: $response');
      print('================================');

      if (response['success'] == true && response['data'] != null) {
        return Donation.fromJson(response['data']);
      } else {
        print('=== CREATE DONATION FAILED ===');
        print('Message: ${response['message']}');
        print('Error: ${response['error']}');
        print('==============================');
        throw ApiException(
          response['message'] ?? 'Failed to create donation',
          400,
        );
      }
    } catch (e) {
      print('=== CREATE DONATION EXCEPTION ===');
      print('Error type: ${e.runtimeType}');
      print('Error: $e');
      print('=================================');
      rethrow;
    }
  }

  // Get all donations for current user
  Future<List<Donation>> getDonations() async {
    try {
      final response = await _apiService.get(ApiConfig.userDonations);

      if (response['success'] == true && response['data'] != null) {
        final List<dynamic> donationsJson = response['data'] as List;
        return donationsJson.map((json) => Donation.fromJson(json)).toList();
      } else {
        throw ApiException(
          response['message'] ?? 'Failed to fetch donations',
          400,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  // Get donation by ID
  Future<Donation> getDonationById(int donationId) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.donationById, {
        'id': donationId,
      });

      final response = await _apiService.get(endpoint);

      if (response['success'] == true && response['data'] != null) {
        return Donation.fromJson(response['data']);
      } else {
        throw ApiException(
          response['message'] ?? 'Failed to fetch donation',
          400,
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  // Cancel/delete donation
  Future<bool> cancelDonation(int donationId) async {
    try {
      final endpoint = ApiConfig.replacePath(ApiConfig.donationById, {
        'id': donationId,
      });

      final response = await _apiService.delete(endpoint);
      return response['success'] == true;
    } catch (e) {
      rethrow;
    }
  }

  // Get upcoming donations (planned or confirmed)
  List<Donation> getUpcomingDonations(List<Donation> donations) {
    final now = DateTime.now();
    return donations
        .where(
          (d) => (d.isPlanned || d.isConfirmed) && d.donationDate.isAfter(now),
        )
        .toList();
  }

  // Get past donations
  List<Donation> getPastDonations(List<Donation> donations) {
    final now = DateTime.now();
    return donations
        .where((d) => d.donationDate.isBefore(now) && d.isConfirmed)
        .toList();
  }

  // Check if user can donate (2 months restriction)
  bool canDonate(List<Donation> donations) {
    final confirmedDonations = donations.where((d) => d.isConfirmed).toList()
      ..sort((a, b) => b.donationDate.compareTo(a.donationDate));

    if (confirmedDonations.isEmpty) return true;

    final lastDonation = confirmedDonations.first;
    final daysSinceLastDonation = DateTime.now()
        .difference(lastDonation.donationDate)
        .inDays;

    return daysSinceLastDonation >= 60; // 2 months = ~60 days
  }

  // Get days until next donation
  int daysUntilNextDonation(List<Donation> donations) {
    final confirmedDonations = donations.where((d) => d.isConfirmed).toList()
      ..sort((a, b) => b.donationDate.compareTo(a.donationDate));

    if (confirmedDonations.isEmpty) return 0;

    final lastDonation = confirmedDonations.first;
    final daysSinceLastDonation = DateTime.now()
        .difference(lastDonation.donationDate)
        .inDays;
    final remaining = 60 - daysSinceLastDonation;

    return remaining > 0 ? remaining : 0;
  }
}
