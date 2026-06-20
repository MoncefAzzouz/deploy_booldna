import 'package:flutter/material.dart';

class AppColors {
  // Primary colors matching the design
  static const Color primary = Color(0xFFFF5757); // Coral red
  static const Color primaryDark = Color(0xFFE84545);
  static const Color primaryLight = Color(0xFFFF7B7B);

  // Background colors
  static const Color background = Color(0xFFF5F5F5);
  static const Color cardBackground = Color(0xFFFFFFFF);
  static const Color lightPurple = Color(0xFFE8E4F3);

  // Text colors
  static const Color textPrimary = Color(0xFF2D3142);
  static const Color textSecondary = Color(0xFF9E9E9E);
  static const Color textLight = Color(0xFFBDBDBD);

  // Blood type colors
  static const Color bloodTypeRed = Color(0xFFFF5757);
  static const Color bloodTypeBg = Color(0xFFFFF5F5);

  // Status colors
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFFA726);
  static const Color error = Color(0xFFEF5350);

  // UI elements
  static const Color divider = Color(0xFFE0E0E0);
  static const Color shadow = Color(0x1A000000);
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

class AppRadius {
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double circular = 100.0;
}

class AppShadows {
  static List<BoxShadow> card = [
    BoxShadow(
      color: AppColors.shadow,
      blurRadius: 20,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> button = [
    BoxShadow(
      color: AppColors.primary.withOpacity(0.3),
      blurRadius: 12,
      offset: const Offset(0, 4),
    ),
  ];
}
