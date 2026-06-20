import 'dart:async';
import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class InfoCard {
  final IconData icon;
  final String text;
  final Color iconColor;
  final Color iconBgColor;

  InfoCard({
    required this.icon,
    required this.text,
    required this.iconColor,
    required this.iconBgColor,
  });
}

class InfoCardsCarousel extends StatefulWidget {
  const InfoCardsCarousel({super.key});

  @override
  State<InfoCardsCarousel> createState() => _InfoCardsCarouselState();
}

class _InfoCardsCarouselState extends State<InfoCardsCarousel> {
  final PageController _pageController = PageController(viewportFraction: 0.9);
  int _currentPage = 0;
  Timer? _timer;

  final List<InfoCard> _infoCards = [
    InfoCard(
      icon: Icons.favorite,
      text:
          'هل تعلم أن التبرع بالدم مرة واحدة قد يساهم في إنقاذ حياة ثلاث أشخاص',
      iconColor: AppColors.primary,
      iconBgColor: AppColors.bloodTypeBg,
    ),
    InfoCard(
      icon: Icons.water_drop,
      text:
          'يمكنك التبرع بالدم كل 56 يوماً، وهذا يعني أنك تستطيع إنقاذ حياة 6 أشخاص سنوياً',
      iconColor: AppColors.primary,
      iconBgColor: AppColors.bloodTypeBg,
    ),
    InfoCard(
      icon: Icons.health_and_safety,
      text: 'التبرع بالدم يساعد في تحسين صحة القلب والأوعية الدموية',
      iconColor: AppColors.primary,
      iconBgColor: AppColors.bloodTypeBg,
    ),
    InfoCard(
      icon: Icons.timer,
      text: 'عملية التبرع بالدم تستغرق من 10 إلى 15 دقيقة فقط',
      iconColor: AppColors.primary,
      iconBgColor: AppColors.bloodTypeBg,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startAutoPlay();
    _pageController.addListener(() {
      int next = _pageController.page!.round();
      if (_currentPage != next) {
        setState(() {
          _currentPage = next;
        });
      }
    });
  }

  void _startAutoPlay() {
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_pageController.hasClients) {
        int nextPage = _currentPage + 1;
        if (nextPage >= _infoCards.length) {
          nextPage = 0;
        }
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _pageController,
            itemCount: _infoCards.length,
            itemBuilder: (context, index) {
              return AnimatedBuilder(
                animation: _pageController,
                builder: (context, child) {
                  double value = 1.0;
                  if (_pageController.position.haveDimensions) {
                    value = _pageController.page! - index;
                    value = (1 - (value.abs() * 0.15)).clamp(0.85, 1.0);
                  }
                  return Center(
                    child: SizedBox(
                      height: Curves.easeInOut.transform(value) * 200,
                      child: child,
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.xs,
                  ),
                  child: _buildInfoCard(_infoCards[index]),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        // Page indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _infoCards.length,
            (index) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _currentPage == index ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _currentPage == index
                    ? AppColors.primary
                    : AppColors.divider,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard(InfoCard card) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow.withOpacity(0.15),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: card.iconBgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(card.icon, color: card.iconColor, size: 40),
          ),
          const SizedBox(height: AppSpacing.md),
          // Text
          Text(
            card.text,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(height: 1.6, fontSize: 15),
            textAlign: TextAlign.center,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
