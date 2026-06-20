import 'dart:convert';

class Questionnaire {
  final int questionnaireId;
  final String name;
  final String? description;
  final bool isActive;

  Questionnaire({
    required this.questionnaireId,
    required this.name,
    this.description,
    required this.isActive,
  });

  factory Questionnaire.fromJson(Map<String, dynamic> json) {
    return Questionnaire(
      questionnaireId: json['questionnaireId'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      isActive: json['isActive'] as bool? ?? true,
    );
  }
}

class HealthQuestion {
  final int questionId;
  final int questionnaireId;
  final String question;
  final String questionType;
  final List<String> options;
  final bool isRequired;
  final int order;

  HealthQuestion({
    required this.questionId,
    required this.questionnaireId,
    required this.question,
    required this.questionType,
    required this.options,
    required this.isRequired,
    required this.order,
  });

  factory HealthQuestion.fromJson(Map<String, dynamic> json) {
    return HealthQuestion(
      questionId: json['questionId'] as int,
      questionnaireId: json['questionnaireId'] as int,
      question: json['question'] as String,
      questionType: json['questionType'] as String? ?? 'yes_no',
      options: _parseOptions(json['options']),
      isRequired: json['isRequired'] as bool? ?? true,
      order: json['order'] as int? ?? 0,
    );
  }

  static List<String> _parseOptions(dynamic value) {
    if (value == null) return [];
    if (value is List) return value.map((item) => item.toString()).toList();
    if (value is String && value.isNotEmpty) {
      try {
        final decoded = jsonDecode(value);
        if (decoded is List) {
          return decoded.map((item) => item.toString()).toList();
        }
      } catch (_) {
        return value
            .split(',')
            .map((item) => item.trim())
            .where((item) => item.isNotEmpty)
            .toList();
      }
    }
    return [];
  }
}

class QuestionResponseDraft {
  final int questionId;
  final String answer;

  QuestionResponseDraft({required this.questionId, required this.answer});

  Map<String, dynamic> toJson() {
    return {'questionId': questionId, 'answer': answer};
  }
}

class QuestionResponse {
  final int responseId;
  final int donationId;
  final int questionId;
  final String answer;
  final DateTime createdAt;
  final HealthQuestion? question;

  QuestionResponse({
    required this.responseId,
    required this.donationId,
    required this.questionId,
    required this.answer,
    required this.createdAt,
    this.question,
  });

  factory QuestionResponse.fromJson(Map<String, dynamic> json) {
    return QuestionResponse(
      responseId: json['responseId'] as int,
      donationId: json['donationId'] as int,
      questionId: json['questionId'] as int,
      answer: json['answer'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      question: json['question'] != null
          ? HealthQuestion.fromJson(json['question'] as Map<String, dynamic>)
          : null,
    );
  }
}
