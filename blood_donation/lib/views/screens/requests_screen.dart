import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:blood_donation/l10n/generated/app_localizations.dart';
import '../../viewmodels/requests_viewmodel.dart';
import '../../viewmodels/home_viewmodel.dart';
import '../../utils/constants.dart';
import '../widgets/donation_card.dart';
import 'appointment_booking_screen.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _showOtherBloodTypes = false; // Track if 'Other' section is expanded

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.cases),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),

      body: Consumer2<RequestsViewModel, HomeViewModel>(
        builder: (context, viewModel, homeViewModel, child) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final userBloodType = homeViewModel.currentUser?.displayBloodType;

          return RefreshIndicator(
            onRefresh: viewModel.refreshAlerts,
            child: Column(
              children: [
                // Filter tabs
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: AppSpacing.sm,
                  ),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterChip(
                          context,
                          label: l10n.all,
                          icon: Icons.grid_view_rounded,
                          isSelected: viewModel.selectedBloodType == 'الكل',
                          onTap: () => viewModel.filterByBloodType(
                            'الكل',
                            userBloodType: userBloodType,
                          ),
                        ),
                        if (userBloodType != null) ...[
                          const SizedBox(width: AppSpacing.sm),
                          _buildFilterChip(
                            context,
                            label: l10n.myBloodType(userBloodType),
                            icon: Icons.person,
                            isSelected:
                                viewModel.selectedBloodType == userBloodType,
                            onTap: () => viewModel.filterByBloodType(
                              userBloodType,
                              userBloodType: userBloodType,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          _buildFilterChip(
                            context,
                            label: l10n.other,
                            icon: Icons.water_drop,
                            isSelected: _showOtherBloodTypes,
                            onTap: () {
                              setState(() {
                                _showOtherBloodTypes = !_showOtherBloodTypes;
                              });
                            },
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                // Expandable other blood types section
                if (_showOtherBloodTypes && userBloodType != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.sm,
                    ),
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: _getOtherBloodTypes(userBloodType)
                            .map(
                              (bloodType) => Padding(
                                padding: const EdgeInsets.only(
                                  right: AppSpacing.sm,
                                ),
                                child: _buildFilterChip(
                                  context,
                                  label: bloodType,
                                  icon: Icons.water_drop,
                                  isSelected:
                                      viewModel.selectedBloodType == bloodType,
                                  onTap: () => viewModel.filterByBloodType(
                                    bloodType,
                                    userBloodType: userBloodType,
                                  ),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ),
                  ),
                ],

                // Requests list
                Expanded(
                  child: viewModel.filteredAlerts.isEmpty
                      ? Center(child: Text(l10n.noRequests))
                      : ListView.builder(
                          padding: const EdgeInsets.fromLTRB(
                            AppSpacing.md,
                            AppSpacing.sm,
                            AppSpacing.md,
                            80,
                          ), // Bottom padding for FAB
                          itemCount: viewModel.filteredAlerts.length,
                          itemBuilder: (context, index) {
                            final alert = viewModel.filteredAlerts[index];
                            return AnimatedBuilder(
                              animation: _controller,
                              builder: (context, child) {
                                return FadeTransition(
                                  opacity: Tween<double>(begin: 0, end: 1)
                                      .animate(
                                        CurvedAnimation(
                                          parent: _controller,
                                          curve: Interval(
                                            (index * 0.1).clamp(0.0, 1.0),
                                            1.0,
                                            curve: Curves.easeOut,
                                          ),
                                        ),
                                      ),
                                  child: Transform.translate(
                                    offset: Offset(
                                      0,
                                      Tween<double>(begin: 50, end: 0)
                                          .animate(
                                            CurvedAnimation(
                                              parent: _controller,
                                              curve: Interval(
                                                (index * 0.1).clamp(0.0, 1.0),
                                                1.0,
                                                curve: Curves.easeOut,
                                              ),
                                            ),
                                          )
                                          .value,
                                    ),
                                    child: child,
                                  ),
                                );
                              },
                              child: DonationCard(
                                request: alert,
                                onDonate: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => AppointmentBookingScreen(
                                        alert: alert,
                                      ),
                                    ),
                                  );
                                },
                                onViewDetails: () {
                                  _showDetailsDialog(
                                    context,
                                    alert.hospital?.name ?? 'مستشفى',
                                  );
                                },
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // Get list of blood types excluding user's blood type
  List<String> _getOtherBloodTypes(String userBloodType) {
    const allBloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    return allBloodTypes.where((type) => type != userBloodType).toList();
  }

  Widget _buildFilterChip(
    BuildContext context, {
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(30),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
          border: Border.all(
            color: isSelected ? AppColors.primary : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 18,
              color: isSelected ? Colors.white : AppColors.textSecondary,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: isSelected ? Colors.white : AppColors.textSecondary,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDetailsDialog(BuildContext context, String patientName) {
    final l10n = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(l10n.caseDetails),
        content: Text(l10n.caseDetailsFor(patientName)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n.close),
          ),
        ],
      ),
    );
  }
}
