import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/donation.dart';
import '../services/auth_service.dart';
import '../services/donations_service.dart';

class HomeViewModel extends ChangeNotifier {
  User? _currentUser;
  List<Donation> _donations = [];
  bool _isLoading = false;
  String? _errorMessage;

  final AuthService _authService = AuthService();
  final DonationsService _donationsService = DonationsService();

  User? get currentUser => _currentUser;
  List<Donation> get donations => _donations;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Get upcoming appointment
  Donation? get upcomingAppointment {
    final upcoming = _donationsService.getUpcomingDonations(_donations);
    return upcoming.isNotEmpty ? upcoming.first : null;
  }

  // Check if user can donate
  bool get canDonate => _donationsService.canDonate(_donations);

  // Days until next donation
  int get daysUntilNextDonation =>
      _donationsService.daysUntilNextDonation(_donations);

  // Total confirmed donations
  int get totalDonations => _donations.where((d) => d.isConfirmed).length;

  HomeViewModel() {
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Check if user is logged in
      final isLoggedIn = await _authService.isLoggedIn();
      if (!isLoggedIn) {
        _isLoading = false;
        notifyListeners();
        return;
      }

      _currentUser = await _authService.getStoredUser();
      if (_currentUser == null) {
        await _authService.logout();
        _isLoading = false;
        notifyListeners();
        return;
      }

      // Load donations
      await _loadDonations();

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _loadDonations() async {
    try {
      _donations = await _donationsService.getDonations();
      notifyListeners();
    } catch (e) {
      if (kDebugMode) {
        print('Error loading donations: $e');
      }
      // Don't throw, just log - donations are optional
    }
  }

  Future<void> refreshData() async {
    await _loadUserData();
  }

  void setUser(User user) {
    _currentUser = user;
    notifyListeners();
    // Load donations for this user
    _loadDonations();
  }

  Future<void> updateUser(
    String name,
    String email,
    String phone,
    String bloodType,
  ) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Note: The API doesn't have a user update endpoint yet
      // This would need to be implemented on the server side
      // For now, just update locally
      if (_currentUser != null) {
        _currentUser = User(
          userId: _currentUser!.userId,
          fullName: name,
          email: email,
          phoneNumber: phone,
          bloodGroup: User.toApiBloodGroup(bloodType),
          birthDate: _currentUser!.birthDate,
          gender: _currentUser!.gender,
          address: _currentUser!.address,
          isVerified: _currentUser!.isVerified,
          emailVerifiedAt: _currentUser!.emailVerifiedAt,
          lastDonationDate: _currentUser!.lastDonationDate,
          isRegularDonor: _currentUser!.isRegularDonor,
          lastLoginAt: _currentUser!.lastLoginAt,
          createdAt: _currentUser!.createdAt,
          updatedAt: DateTime.now(),
        );
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _currentUser = null;
    _donations = [];
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
