import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class BloodTypeBadge extends StatelessWidget {
  final String bloodType;
  final double size;
  final bool showLabel;

  const BloodTypeBadge({
    super.key,
    required this.bloodType,
    this.size = 60,
    this.showLabel = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: AppColors.bloodTypeRed,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(size / 2),
              topRight: Radius.circular(size / 2),
              bottomLeft: Radius.circular(size / 2),
              bottomRight: const Radius.circular(4),
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.bloodTypeRed.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Center(
            child: Text(
              bloodType,
              style: TextStyle(
                color: Colors.white,
                fontSize: size * 0.35,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        if (showLabel) ...[
          const SizedBox(height: AppSpacing.sm),
          Text('الحالات', style: Theme.of(context).textTheme.bodySmall),
        ],
      ],
    );
  }
}
