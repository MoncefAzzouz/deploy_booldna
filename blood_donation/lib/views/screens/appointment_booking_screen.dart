import 'package:flutter/material.dart';
import 'package:blood_donation/l10n/generated/app_localizations.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/home_viewmodel.dart';
import '../../utils/constants.dart';
import '../../models/blood_alert.dart';
import '../../services/donations_service.dart';
import '../../services/api_service.dart';
import '../../models/questionnaire.dart';
import '../../services/notification_service.dart';
import '../../services/questionnaire_service.dart';

class AppointmentBookingScreen extends StatefulWidget {
  final BloodAlert alert;

  const AppointmentBookingScreen({super.key, required this.alert});

  @override
  State<AppointmentBookingScreen> createState() =>
      _AppointmentBookingScreenState();
}

class _AppointmentBookingScreenState extends State<AppointmentBookingScreen> {
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  bool _isLoading = false;

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 90)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
          child: Theme(
            data: Theme.of(context).copyWith(
              colorScheme: ColorScheme.light(
                primary: AppColors.primary,
                onPrimary: Colors.white,
                surface: Colors.white,
                onSurface: AppColors.textPrimary,
              ),
            ),
            child: child!,
          ),
        );
      },
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  Future<void> _confirmAppointment() async {
    final l10n = AppLocalizations.of(context)!;
    if (_selectedDate == null || _selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(AppLocalizations.of(context)!.selectDateAndTime),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final homeViewModel = Provider.of<HomeViewModel>(context, listen: false);
    final currentUser = homeViewModel.currentUser;

    if (currentUser == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(AppLocalizations.of(context)!.pleaseLoginFirst),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Create donation via API
      final donationsService = DonationsService();
      final donationDateTime = DateTime(
        _selectedDate!.year,
        _selectedDate!.month,
        _selectedDate!.day,
        _selectedTime!.hour,
        _selectedTime!.minute,
      );

      if (!donationDateTime.isAfter(DateTime.now())) {
        throw ApiException('Donation date must be in the future', 400);
      }

      final questionnaireResult = await _completeQuestionnaire();
      if (questionnaireResult == null) {
        if (mounted) {
          setState(() => _isLoading = false);
        }
        return;
      }

      await donationsService.createDonation(
        userId: currentUser.userId,
        alertId: widget.alert.alertId,
        donationDate: donationDateTime,
        questionnaireCompleted: true,
        questionnaireId: questionnaireResult.questionnaireId,
        questionResponses: questionnaireResult.responses
            .map((response) => response.toJson())
            .toList(),
        notes: null,
      );

      if (mounted) {
        setState(() => _isLoading = false);

        // Schedule notifications
        final notificationService = NotificationService();
        await notificationService.showBookingConfirmation(
          widget.alert.hospital?.name ?? l10n.hospital,
          donationDateTime,
        );

        // Schedule daily reminders (using alertId as base ID)
        await notificationService.scheduleDailyReminders(
          widget.alert.alertId,
          widget.alert.hospital?.name ?? l10n.hospital,
          donationDateTime,
        );

        // Refresh user data to get updated donations
        await homeViewModel.refreshData();

        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(l10n.appointmentBooked),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } on ApiException catch (e) {
      print('=== APPOINTMENT BOOKING API ERROR ===');
      print('Status Code: ${e.statusCode}');
      print('Message: ${e.message}');
      print('====================================');
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message), backgroundColor: AppColors.error),
        );
      }
    } catch (e, stackTrace) {
      print('=== APPOINTMENT BOOKING EXCEPTION ===');
      print('Error type: ${e.runtimeType}');
      print('Error: $e');
      print('Stacktrace: $stackTrace');
      print('=====================================');
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('حدث خطأ: ${e.toString()}'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  Future<_QuestionnaireResult?> _completeQuestionnaire() async {
    final service = QuestionnaireService();
    final questionnaires = await service.getQuestionnaires();

    if (questionnaires.isEmpty) {
      throw ApiException('No active questionnaire is available', 400);
    }

    final questionnaire = questionnaires.first;
    final questions = await service.getQuestions(questionnaire.questionnaireId);

    if (!mounted) return null;

    return showDialog<_QuestionnaireResult>(
      context: context,
      barrierDismissible: false,
      builder: (context) => _QuestionnaireDialog(
        questionnaire: questionnaire,
        questions: questions,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.bookAppointment),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Patient info card
            Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                boxShadow: AppShadows.card,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: AppColors.bloodTypeBg,
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                        child: Text(
                          widget.alert.displayBloodType,
                          style: Theme.of(context).textTheme.headlineSmall
                              ?.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.alert.hospital?.name ?? l10n.hospital,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: AppSpacing.xs),
                            Text(
                              widget.alert.getLocalizedUrgencyLabel(l10n),
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on_outlined,
                        size: 20,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        widget.alert.hospital?.city ??
                            widget.alert.hospital?.address ??
                            l10n.location,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    children: [
                      Icon(
                        Icons.water_drop_outlined,
                        size: 20,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        l10n.unitsRequired(widget.alert.quantityUnits),
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Date selection
            Text(
              l10n.selectDate,
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: AppSpacing.sm),
            InkWell(
              onTap: () => _selectDate(context),
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.cardBackground,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.divider),
                ),
                child: Row(
                  children: [
                    Icon(Icons.calendar_today, color: AppColors.primary),
                    const SizedBox(width: AppSpacing.md),
                    Text(
                      _selectedDate == null
                          ? l10n.selectDate
                          : '${_selectedDate!.day.toString().padLeft(2, '0')}/${_selectedDate!.month.toString().padLeft(2, '0')}/${_selectedDate!.year}',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: _selectedDate == null
                            ? AppColors.textSecondary
                            : AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: AppSpacing.lg),

            // Time selection
            Text(
              l10n.selectTime,
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: AppSpacing.sm),
            InkWell(
              onTap: () => _selectTime(context),
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.cardBackground,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.divider),
                ),
                child: Row(
                  children: [
                    Icon(Icons.access_time, color: AppColors.primary),
                    const SizedBox(width: AppSpacing.md),
                    Text(
                      _selectedTime == null
                          ? l10n.selectTime
                          : '${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')}',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: _selectedTime == null
                            ? AppColors.textSecondary
                            : AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Confirm button
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AppRadius.lg),
                boxShadow: AppShadows.button,
              ),
              child: ElevatedButton(
                onPressed: _isLoading ? null : _confirmAppointment,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                        ),
                      )
                    : const Text('تأكيد الموعد'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuestionnaireResult {
  final int questionnaireId;
  final List<QuestionResponseDraft> responses;

  _QuestionnaireResult({
    required this.questionnaireId,
    required this.responses,
  });
}

class _QuestionnaireDialog extends StatefulWidget {
  final Questionnaire questionnaire;
  final List<HealthQuestion> questions;

  const _QuestionnaireDialog({
    required this.questionnaire,
    required this.questions,
  });

  @override
  State<_QuestionnaireDialog> createState() => _QuestionnaireDialogState();
}

class _QuestionnaireDialogState extends State<_QuestionnaireDialog> {
  final Map<int, String> _answers = {};

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.questionnaire.name),
      content: SizedBox(
        width: double.maxFinite,
        child: widget.questions.isEmpty
            ? const Text('No questions are available.')
            : ListView.separated(
                shrinkWrap: true,
                itemCount: widget.questions.length,
                separatorBuilder: (_, __) => const Divider(),
                itemBuilder: (context, index) {
                  final question = widget.questions[index];
                  return _buildQuestion(question);
                },
              ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _canSubmit ? _submit : null,
          child: const Text('Continue'),
        ),
      ],
    );
  }

  Widget _buildQuestion(HealthQuestion question) {
    if (question.questionType == 'text') {
      return TextField(
        decoration: InputDecoration(labelText: question.question),
        onChanged: (value) {
          setState(() => _answers[question.questionId] = value);
        },
      );
    }

    final options =
        question.questionType == 'multiple_choice' &&
            question.options.isNotEmpty
        ? question.options
        : const ['yes', 'no'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(question.question, style: Theme.of(context).textTheme.bodyLarge),
        const SizedBox(height: AppSpacing.sm),
        ...options.map(
          (option) => RadioListTile<String>(
            contentPadding: EdgeInsets.zero,
            title: Text(option),
            value: option,
            groupValue: _answers[question.questionId],
            onChanged: (value) {
              if (value == null) return;
              setState(() => _answers[question.questionId] = value);
            },
          ),
        ),
      ],
    );
  }

  bool get _canSubmit {
    return widget.questions.every((question) {
      if (!question.isRequired) return true;
      return (_answers[question.questionId] ?? '').trim().isNotEmpty;
    });
  }

  void _submit() {
    final responses = widget.questions
        .where(
          (question) => (_answers[question.questionId] ?? '').trim().isNotEmpty,
        )
        .map(
          (question) => QuestionResponseDraft(
            questionId: question.questionId,
            answer: _answers[question.questionId]!.trim(),
          ),
        )
        .toList();

    Navigator.pop(
      context,
      _QuestionnaireResult(
        questionnaireId: widget.questionnaire.questionnaireId,
        responses: responses,
      ),
    );
  }
}
