import 'dart:async';
import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/requests_viewmodel.dart';
import '../views/screens/appointment_booking_screen.dart';

class DeepLinkService {
  late AppLinks _appLinks;
  StreamSubscription<Uri>? _linkSubscription;

  void initDeepLinks(BuildContext context) {
    _appLinks = AppLinks();

    // Check initial link
    _checkInitialLink(context);

    // Listen for link changes
    _linkSubscription = _appLinks.uriLinkStream.listen((uri) {
      _handleLink(context, uri);
    });
  }

  Future<void> _checkInitialLink(BuildContext context) async {
    try {
      final uri = await _appLinks.getInitialLink();
      if (uri != null) {
        _handleLink(context, uri);
      }
    } catch (e) {
      debugPrint('Error getting initial link: $e');
    }
  }

  void _handleLink(BuildContext context, Uri uri) {
    // Expected format: blooddonation://request?id=123
    if (uri.scheme == 'blooddonation' && uri.host == 'request') {
      final String? id = uri.queryParameters['id'];
      if (id != null) {
        _navigateToRequest(context, id);
      }
    }
  }

  void _navigateToRequest(BuildContext context, String id) {
    final viewModel = Provider.of<RequestsViewModel>(context, listen: false);

    // Ensure data is loaded (this is a simplified approach)
    if (viewModel.filteredAlerts.isEmpty) {
      // In a real app, we might need to wait for data or fetch specifically
      Future.delayed(const Duration(milliseconds: 1000), () {
        _navigateToRequest(context, id);
      });
      return;
    }

    // Convert string ID to int
    final alertId = int.tryParse(id);
    if (alertId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('معرف غير صالح')));
      return;
    }

    // Find alert by ID
    viewModel.getAlertById(alertId).then((alert) {
      if (alert != null) {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => AppointmentBookingScreen(alert: alert),
          ),
        );
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('الحالة غير موجودة')));
      }
    });
  }

  void dispose() {
    _linkSubscription?.cancel();
  }
}
