import 'package:flutter/material.dart';
import 'package:blood_donation/l10n/generated/app_localizations.dart';
import 'dart:math' as math;

class BloodDonationTrackerScreen extends StatefulWidget {
  final String lastDonationDate;
  final int daysUntilNextDonation;

  const BloodDonationTrackerScreen({
    super.key,
    required this.lastDonationDate,
    required this.daysUntilNextDonation,
  });

  @override
  State<BloodDonationTrackerScreen> createState() =>
      _BloodDonationTrackerScreenState();
}

class _BloodDonationTrackerScreenState extends State<BloodDonationTrackerScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();

    // Controller runs indefinitely for the wave animation
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();

    // Since we are repeating the controller for waves, we need a separate way to animate the level once
    // Actually, let's use a separate controller for level if needed, or just drive level directly.
    // Simpler approach: Use the controller for wave phase (0->1) and just animate level on mount.
  }

  // Correction: We need two animations. One for the wave (continuous) and one for the fill level (once).
  // Let's refactor init.

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF3B2E5D), // Dark purple background
      body: Stack(
        children: [
          // Close button
          Positioned(
            top: 50,
            left: 20,
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.white, size: 28),
              onPressed: () => Navigator.pop(context),
            ),
          ),

          // Done button (optional)
          Positioned(
            top: 50,
            right: 20,
            child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                AppLocalizations.of(context)!.done,
                style: const TextStyle(
                  color: Color(0xFF4ACCE6), // Light blue
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),

          Center(
            child: SizedBox(
              width: 300,
              height: 600,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Background Body Silhouette (Grey tint)
                  Positioned.fill(
                    child: ColorFiltered(
                      colorFilter: const ColorFilter.mode(
                        Colors.white24,
                        BlendMode.srcIn,
                      ),
                      child: Image.asset(
                        'assets/images/body_silhouette.png',
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),

                  // Animated Liquid Fill
                  // We mask the wave container with the body image
                  Positioned.fill(
                    child: ShaderMask(
                      shaderCallback: (bounds) {
                        return const LinearGradient(
                          colors: [Colors.white, Colors.white],
                          stops: [0.0, 1.0],
                        ).createShader(bounds);
                      },
                      blendMode: BlendMode.dstIn,
                      child: Image.asset(
                        'assets/images/body_silhouette.png',
                        fit: BoxFit.contain,
                        color: Colors.white, // Mask source
                      ),
                    ),
                  ),

                  // The actual filling content masked by the body
                  Positioned.fill(child: _buildLiquidFill()),

                  // Overlay Labels
                  _buildLabels(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiquidFill() {
    // We need to mask the liquid with the body shape.
    // The previous approach masked the container with the image.
    // Better approach:
    // 1. Draw the liquid (wave) in a container.
    // 2. Wrap that container in a ShaderMask that uses the body image as the mask (DST_IN).

    return ShaderMask(
      blendMode: BlendMode.dstIn,
      shaderCallback: (bounds) => const LinearGradient(
        colors: [Colors.white, Colors.white],
      ).createShader(bounds),
      child: Stack(
        children: [
          // The body shape acting as a mask container
          Positioned.fill(
            child: Image.asset(
              'assets/images/body_silhouette.png',
              fit: BoxFit.contain,
            ),
          ),
          // The Wave
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _animationController,
              builder: (context, child) {
                return ClipPath(
                  clipper: WaveClipper(
                    animationValue: _animationController.value,
                    fillLevel: (90 - widget.daysUntilNextDonation) / 90,
                  ),
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Color(0xFFFF5252), // Bright Red
                          Color(0xFFFF1744), // Deeper Red
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLabels() {
    final l10n = AppLocalizations.of(context)!;
    return Stack(
      children: [
        // "You will be able to donate..." Label
        if (widget.daysUntilNextDonation > 0)
          Positioned(
            right: 0,
            top: 200,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.willBeAbleToDonate,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: l10n.inDays(widget.daysUntilNextDonation),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 8),
              ],
            ),
          ),

        // "Donated on..." Label
        Positioned(
          right: 0,
          bottom: 50,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              // Connector Line to feet
              Container(
                margin: const EdgeInsets.only(bottom: 15, right: 10),
                width: 40,
                height: 1,
                color: Colors.white54,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l10n.donatedOn,
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  Text(
                    widget.lastDonationDate,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class WaveClipper extends CustomClipper<Path> {
  final double animationValue;
  final double fillLevel;

  WaveClipper({required this.animationValue, required this.fillLevel});

  @override
  Path getClip(Size size) {
    final path = Path();
    final clampedFill = fillLevel.clamp(0.0, 1.0);

    // Calculate water height based on fill level
    // fillLevel 0 = empty (bottom), 1 = full (top)
    // In Flutter coordinate system, 0 is top.
    final baseHeight = size.height * (1 - clampedFill);

    path.moveTo(0, baseHeight);

    // Draw wave
    for (double i = 0; i <= size.width; i++) {
      path.lineTo(
        i,
        baseHeight +
            math.sin(
                  (i / size.width * 2 * math.pi) +
                      (animationValue * 2 * math.pi),
                ) *
                10,
      );
    }

    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    return path;
  }

  @override
  bool shouldReclip(WaveClipper oldClipper) => true;
}
