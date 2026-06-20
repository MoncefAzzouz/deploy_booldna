import 'api_config.dart';
import 'api_service.dart';
import '../models/questionnaire.dart';

class QuestionnaireService {
  final ApiService _apiService = ApiService();

  Future<List<Questionnaire>> getQuestionnaires() async {
    final response = await _apiService.get(ApiConfig.questionnaires);

    if (response['success'] == true && response['data'] != null) {
      final List<dynamic> questionnairesJson = response['data'] as List;
      return questionnairesJson
          .map((json) => Questionnaire.fromJson(json))
          .where((questionnaire) => questionnaire.isActive)
          .toList();
    }

    throw ApiException(
      response['message'] ?? 'Failed to fetch questionnaires',
      400,
    );
  }

  Future<Questionnaire> getQuestionnaireById(int questionnaireId) async {
    final endpoint = ApiConfig.replacePath(ApiConfig.questionnaireById, {
      'id': questionnaireId,
    });

    final response = await _apiService.get(endpoint);

    if (response['success'] == true && response['data'] != null) {
      return Questionnaire.fromJson(response['data']);
    }

    throw ApiException(
      response['message'] ?? 'Failed to fetch questionnaire',
      400,
    );
  }

  Future<List<HealthQuestion>> getQuestions(int questionnaireId) async {
    final endpoint = ApiConfig.replacePath(ApiConfig.questionnaireQuestions, {
      'id': questionnaireId,
    });

    final response = await _apiService.get(endpoint);

    if (response['success'] == true && response['data'] != null) {
      final List<dynamic> questionsJson = response['data'] as List;
      final questions = questionsJson
          .map((json) => HealthQuestion.fromJson(json))
          .where(
            (question) => question.isRequired || question.question.isNotEmpty,
          )
          .toList();
      questions.sort((a, b) => a.order.compareTo(b.order));
      return questions;
    }

    throw ApiException(response['message'] ?? 'Failed to fetch questions', 400);
  }

  Future<List<HealthQuestion>> getAllQuestions() async {
    final response = await _apiService.get(ApiConfig.questions);

    if (response['success'] == true && response['data'] != null) {
      final List<dynamic> questionsJson = response['data'] as List;
      return questionsJson
          .map((json) => HealthQuestion.fromJson(json))
          .toList();
    }

    throw ApiException(response['message'] ?? 'Failed to fetch questions', 400);
  }

  Future<HealthQuestion> getQuestionById(int questionId) async {
    final endpoint = ApiConfig.replacePath(ApiConfig.questionById, {
      'id': questionId,
    });

    final response = await _apiService.get(endpoint);

    if (response['success'] == true && response['data'] != null) {
      return HealthQuestion.fromJson(response['data']);
    }

    throw ApiException(response['message'] ?? 'Failed to fetch question', 400);
  }

  Future<List<QuestionResponse>> submitQuestionResponses({
    required int donationId,
    required List<QuestionResponseDraft> responses,
  }) async {
    final response = await _apiService.post(ApiConfig.questionResponses, {
      'donationId': donationId,
      'responses': responses.map((r) => r.toJson()).toList(),
    });

    if (response['success'] == true && response['data'] != null) {
      final List<dynamic> responsesJson = response['data'] as List;
      return responsesJson
          .map((json) => QuestionResponse.fromJson(json))
          .toList();
    }

    throw ApiException(
      response['message'] ?? 'Failed to submit question responses',
      400,
    );
  }

  Future<List<QuestionResponse>> getQuestionResponsesByDonation(
    int donationId,
  ) async {
    final endpoint = ApiConfig.replacePath(
      ApiConfig.questionResponsesByDonation,
      {'donationId': donationId},
    );

    final response = await _apiService.get(endpoint);

    if (response['success'] == true && response['data'] != null) {
      final List<dynamic> responsesJson = response['data'] as List;
      return responsesJson
          .map((json) => QuestionResponse.fromJson(json))
          .toList();
    }

    throw ApiException(
      response['message'] ?? 'Failed to fetch question responses',
      400,
    );
  }

  Future<QuestionResponse> getQuestionResponseById(int responseId) async {
    final endpoint = ApiConfig.replacePath(ApiConfig.questionResponseById, {
      'responseId': responseId,
    });

    final response = await _apiService.get(endpoint);

    if (response['success'] == true && response['data'] != null) {
      return QuestionResponse.fromJson(response['data']);
    }

    throw ApiException(
      response['message'] ?? 'Failed to fetch question response',
      400,
    );
  }
}
