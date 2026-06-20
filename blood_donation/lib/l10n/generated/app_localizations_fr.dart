// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'App de Don de Sang';

  @override
  String get bloodDonation => 'Don de Sang';

  @override
  String get cases => 'Cas';

  @override
  String get bloodBanks => 'Banques de Sang';

  @override
  String get profile => 'Profil';

  @override
  String get settings => 'Paramètres';

  @override
  String get language => 'Langue';

  @override
  String get logout => 'Déconnexion';

  @override
  String get edit => 'Modifier';

  @override
  String get noData => 'Aucune donnée';

  @override
  String get viewAll => 'Voir tout';

  @override
  String get donations => 'Dons';

  @override
  String get cancel => 'Annuler';

  @override
  String get confirmLogout => 'Êtes-vous sûr de vouloir vous déconnecter ?';

  @override
  String get units => 'Unité';

  @override
  String get fullName => 'Nom complet';

  @override
  String get selectLanguage => 'Choisir la langue';

  @override
  String get arabic => 'Arabe';

  @override
  String get english => 'Anglais';

  @override
  String get french => 'Français';

  @override
  String get location => 'Emplacement';

  @override
  String get home => 'Accueil';

  @override
  String welcomeName(String name) {
    return 'Bonjour, $name';
  }

  @override
  String get dontForgetAppointment => 'N\'oubliez pas votre rendez-vous !';

  @override
  String atTime(String time) {
    return 'à $time';
  }

  @override
  String get noAppointment => 'Aucun rendez-vous';

  @override
  String get timeToDonate => 'Il est temps de donner !';

  @override
  String get nextDonationSoon => 'Prochain don bientôt';

  @override
  String get eligibleToDonate => 'Vous êtes éligible pour donner du sang';

  @override
  String get thanksLastDonation =>
      'Merci pour votre dernier don ! Vous serez bientôt à nouveau éligible pour donner.';

  @override
  String get whereToDonate => 'Où donner ?';

  @override
  String get all => 'Tout';

  @override
  String myBloodType(String bloodType) {
    return 'Mon Groupe ($bloodType)';
  }

  @override
  String get other => 'Autre';

  @override
  String get noRequests => 'Aucune demande';

  @override
  String get hospital => 'Hôpital';

  @override
  String get caseDetails => 'Détails du cas';

  @override
  String caseDetailsFor(String name) {
    return 'Détails du cas pour $name';
  }

  @override
  String get close => 'Fermer';

  @override
  String get togetherSaveLives => 'Ensemble nous sauvons des vies';

  @override
  String get welcomeBack => 'Bienvenue';

  @override
  String get loginToContinue => 'Connectez-vous pour continuer';

  @override
  String get email => 'E-mail';

  @override
  String get enterEmail => 'Entrez votre e-mail';

  @override
  String get emailRequired => 'Veuillez entrer votre e-mail';

  @override
  String get invalidEmail => 'Veuillez entrer un e-mail valide';

  @override
  String get password => 'Mot de passe';

  @override
  String get enterPassword => 'Entrez votre mot de passe';

  @override
  String get passwordRequired => 'Veuillez entrer votre mot de passe';

  @override
  String passwordTooShort(int min) {
    return 'Le mot de passe doit comporter au moins $min caractères';
  }

  @override
  String get forgotPassword => 'Mot de passe oublié ?';

  @override
  String get login => 'Se connecter';

  @override
  String get or => 'Ou';

  @override
  String get loginWithGoogle => 'Se connecter avec Google';

  @override
  String get dontHaveAccount => 'Vous n\'avez pas de compte ? ';

  @override
  String get registerNow => 'Inscrivez-vous maintenant';

  @override
  String errorOccurred(String error) {
    return 'Une erreur s\'est produite : $error';
  }

  @override
  String get createNewAccount => 'Créer un nouveau compte';

  @override
  String get joinUsSaveLives => 'Rejoignez-nous et aidez à sauver des vies';

  @override
  String get enterFullName => 'Entrez votre nom complet';

  @override
  String get nameRequired => 'Veuillez entrer votre nom';

  @override
  String nameTooShort(int min) {
    return 'Le nom doit comporter au moins $min caractères';
  }

  @override
  String get phoneNumber => 'Numéro de téléphone';

  @override
  String get enterPhoneNumber => 'Entrez votre numéro de téléphone';

  @override
  String get phoneRequired => 'Veuillez entrer votre numéro de téléphone';

  @override
  String get invalidPhone => 'Numéro de téléphone invalide';

  @override
  String get address => 'Adresse';

  @override
  String get addressRequired => 'Veuillez entrer votre adresse';

  @override
  String get enterAddress => 'Entrez votre adresse';

  @override
  String addressTooShort(int min) {
    return 'L\'adresse doit comporter au moins $min caractères';
  }

  @override
  String get birthDate => 'Date de naissance';

  @override
  String get pickBirthDate => 'Choisissez votre date de naissance';

  @override
  String get birthDateRequired => 'Veuillez choisir votre date de naissance';

  @override
  String tooYoung(int age) {
    return 'Vous devez avoir au moins $age ans';
  }

  @override
  String get gender => 'Genre';

  @override
  String get selectGender => 'Sélectionnez le genre';

  @override
  String get male => 'Homme';

  @override
  String get female => 'Femme';

  @override
  String get genderOther => 'Autre';

  @override
  String get bloodGroup => 'Groupe sanguin';

  @override
  String get selectBloodGroup => 'Sélectionnez votre groupe sanguin';

  @override
  String get bloodGroupRequired => 'Veuillez sélectionner votre groupe sanguin';

  @override
  String get confirmPassword => 'Confirmer le mot de passe';

  @override
  String get reEnterPassword => 'Ré-entrez le mot de passe';

  @override
  String get confirmPasswordRequired => 'Veuillez confirmer le mot de passe';

  @override
  String get passwordsDoNotMatch => 'Les mots de passe ne correspondent pas';

  @override
  String get agreeToTerms => 'J\'accepte ';

  @override
  String get termsAndConditions => 'les conditions générales';

  @override
  String get privacyPolicy => 'la politique de confidentialité';

  @override
  String get mustAgreeTerms => 'Vous devez accepter les conditions';

  @override
  String get and => ' et ';

  @override
  String get notAvailable => 'Non disponible';

  @override
  String get bloodUnitsNeeded => 'Unités de sang nécessaires';

  @override
  String get getDirections => 'Obtenir l\'itinéraire';

  @override
  String openingMapFor(String name) {
    return 'Ouverture de la carte pour $name';
  }

  @override
  String get bookAppointment => 'Réserver un rendez-vous pour le don';

  @override
  String get selectDateAndTime => 'Veuillez sélectionner la date et l\'heure';

  @override
  String get pleaseLoginFirst => 'Veuillez vous connecter d\'abord';

  @override
  String get appointmentBooked => 'Rendez-vous réservé avec succès !';

  @override
  String unitsRequired(int quantity) {
    return '$quantity unités requises';
  }

  @override
  String get selectDate => 'Choisir la date';

  @override
  String get selectTime => 'Choisir l\'heure';

  @override
  String get notesOptional => 'Notes (Optionnel)';

  @override
  String get addNotesHint => 'Ajouter des notes supplémentaires...';

  @override
  String get confirmAppointment => 'Confirmer le rendez-vous';

  @override
  String get done => 'Terminé';

  @override
  String get willBeAbleToDonate => 'Vous pourrez faire un don';

  @override
  String inDays(int days) {
    return 'dans $days jours';
  }

  @override
  String get donatedOn => 'Donné le';

  @override
  String get dataUpdatedSuccessfully => 'Données mises à jour avec succès';

  @override
  String get updateError => 'Une erreur s\'est produite lors de la mise à jour';

  @override
  String get editProfile => 'Modifier le profil';

  @override
  String get saveChanges => 'Enregistrer les modifications';

  @override
  String get share => 'Partager';

  @override
  String get donateNow => 'Donner maintenant';

  @override
  String get urgent => 'Urgent';

  @override
  String get medium => 'Moyen';

  @override
  String get low => 'Faible';

  @override
  String get urgentCase => 'Cas urgent';

  @override
  String shareMessage(Object bloodType, Object hospital, Object id) {
    return 'Don de sang pour le cas : $hospital\nGroupe sanguin : $bloodType\nHôpital : $hospital\nLien du cas : blooddonation://request?id=$id';
  }

  @override
  String minutesAgo(Object count) {
    return 'Il y a $count minutes';
  }

  @override
  String hoursAgo(Object count) {
    return 'Il y a $count heures';
  }

  @override
  String get yesterday => 'Hier';

  @override
  String daysAgo(Object count) {
    return 'Il y a $count jours';
  }

  @override
  String get register => 'S\'inscrire';

  @override
  String get alreadyHaveAccount => 'Vous avez déjà un compte ? ';

  @override
  String get resetPassword => 'Réinitialiser le mot de passe';

  @override
  String get forgotPasswordTitle => 'Mot de passe oublié ?';

  @override
  String get forgotPasswordDesc =>
      'Entrez votre e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.';

  @override
  String get sendLink => 'Envoyer le lien';

  @override
  String get resetInstructionsSent =>
      'Instructions de réinitialisation envoyées à votre e-mail';

  @override
  String get checkYourEmail => 'Vérifiez votre e-mail';

  @override
  String verificationEmailSent(String email) {
    return 'Nous avons envoyé un lien de vérification à $email. Veuillez cliquer sur le lien pour vérifier votre compte.';
  }

  @override
  String get verifyBeforeLogin =>
      'Vous devez vérifier votre e-mail avant de vous connecter.';

  @override
  String get goToLogin => 'Aller à la connexion';

  @override
  String get checkSpamFolder =>
      'Si vous ne voyez pas l\'e-mail, vérifiez votre dossier spam.';

  @override
  String get emailNotVerified =>
      'Veuillez vérifier votre e-mail avant de vous connecter. Vérifiez votre boîte de réception.';

  @override
  String get notifications => 'Notifications';

  @override
  String get noNotifications => 'Aucune notification';

  @override
  String get markAsRead => 'Marquer comme lu';

  @override
  String get deleteNotification => 'Supprimer';
}
