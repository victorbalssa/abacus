export default {
  configuration_app_version: 'Version de l\'application',
  configuration_about: 'À propos',
  configuration_clear_option: 'Remise à zéro',
  configuration_clear_confirm_button: 'Oui',
  configuration_clear_alert_title: 'Êtes-vous sûr?',
  configuration_clear_alert_text: 'La remise à zéro de l\'app supprimera:\n'
    + 'Les configurations locales\n'
    + 'ID & secret du client Oauth\n'
    + 'L\'URL de votre instance',
  cancel: 'Annuler',
  configuration_security: 'Sécurité',
  configuration_share_feedback: 'Feedback',
  configuration_report_issue: 'Rapport d\'Erreur',
  configuration_sources: 'Sources',
  configuration_debug: 'Debug',
  configuration_get_help: 'Obtenir de l\'aide',
  assetsHistoryCharts_chart_works: 'Ce graph fonctionne mieux avec un maximum de 4 comptes.',
  assetsHistoryCharts_change_preferences: 'cliquez ici',
  assetsHistoryCharts_choose_preferences_text: 'pour choisir vos comptes préférés dans les préférences de Firefly III :',
  assetsHistoryCharts_home_screen: 'Écran d\'accueil',
  transaction_form_description_required: 'Une description est requise.',
  transaction_form_description_short: 'La description est trop courte.',
  transaction_form_amount_required: 'Le montant est requis.',
  transaction_form_description_label: 'Description',
  transaction_form_sourceAccount_label: 'Compte source',
  transaction_form_destinationAccount_label: 'Compte de destination',
  transaction_form_date_label: 'Date',
  transaction_form_amount_label: 'Montant',
  transaction_form_category_label: 'Catégorie',
  transaction_form_budget_label: 'Budget',
  transaction_form_reset_button: 'Reset',
  transaction_form_submit_button: 'Envoyer',
  transaction_list_alert_title: 'Vous êtes sûr ?',
  transaction_list_alert_text: 'Cette transaction sera définitivement supprimée:',
  transaction_list_delete_button: 'Supprimer',
  transaction_list_cancel_button: 'Annuler',
  auth_form_url_label: 'URL du backend de Firefly III',
  auth_form_url_help: "sans '/' à la fin.",
  auth_form_url_placeholder: "URL du backend de Firefly III (sans '/' à la fin)",
  auth_form_oauth_clientId: 'Oauth Client ID',
  auth_form_oauth_client_secret: 'Oauth Client Secret',
  auth_form_secrets_help_message: 'Tous les secrets sont conservés dans un stockage sécurisé.',
  auth_form_set_redirect: 'Définir l\'URI de redirection à:',
  auth_form_need_help: 'Besoin d\'aide ?',
  auth_form_submit_button_initial: 'S\'identifier',
  auth_form_submit_button_loading: 'Envoi en cours...',
  home_accounts: 'Comptes',
  layout_new_update_header: 'Nouvelle mise à jour disponible',
  layout_new_update_body_text: 'Vous pouvez toujours effectuer une mise à jour ultérieurement dans l\'onglet "Paramètres".',
  layout_new_update_cancel_button: 'Annuler',
  layout_new_update_update_button: 'Mettre à jour',

  // from version 0.31
  transaction_screen_title: 'Nouvelle Transaction',
  navigation_home_tab: 'Accueil',
  navigation_chart_tab: 'Graphique',
  navigation_create_tab: 'Créer',
  navigation_transactions_tab: 'Transactions',
  navigation_settings_tab: 'Paramètres',
  transaction_form_type_withdraw: 'Dépense',
  transaction_form_type_deposit: 'Dépôt',
  transaction_form_type_transfer: 'Transfert',

  // from 0.4.1
  period_switcher_monthly: 'Mensuel',
  period_switcher_quarterly: 'Trimestriel',
  period_switcher_semiannually: 'Semestriel',
  period_switcher_yearly: 'Annuel',
  error_widget_title: 'Une erreur est survenue',
  home_container_error_title: 'Une erreur est survenue',
  home_container_error_description: 'Échec de l\'obtention de l\'accessToken',
  oauth_token_error_title: 'Une erreur est survenue',
  oauth_token_error_description: 'Échec de l\'obtention de l\'accessToken',
  oauth_token_info_title: 'Info',
  oauth_token_info_description: 'Annulation de l\'authentification, vérifiez l\'ID du client et l\'URL du serveur.',
  oauth_token_success_title: 'Réussite',
  oauth_token_success_description: 'Connexion sécurisée prête avec votre instance Firefly III.',
  transaction_form_success_title: 'Réussite',
  transaction_form_success_description: 'Transaction créée. Tapez ici pour aller à la liste des transactions.',
  transaction_form_error_title: 'Erreur',
  home_header_time_range_year: 'Année',
  home_header_time_range_q: 'T', // Put an abbreviation that best represents a quarter
  home_header_time_range_s: 'S', // Put an abbreviation that best represents a semiannual

// from 0.6.0
  balance: 'Solde',
  history: 'Historique',
  home_categories: 'Catégories',
  home_net_worth: 'Valeur Nette',
  
  // from 0.7.0
  home_budgets: 'Budgets',
  configuration_ui: 'Interface Utilisateur',
  configuration_color_mode: 'Mode Sombre',
  auth_form_personal_access_token_label: 'Jeton d\'Accès Personnel',
  auth_use_personal_access_token: 'Utiliser un Jeton d\'Accès Personnel',
  auth_external_heads_up: '❗️Si vous utilisez un fournisseur d\'authentification externe comme Authelia, Keycloak, Cloudflare Tunnels, etc. Les Clients OAuth ne fonctionneront pas. Vous pouvez utiliser uniquement des Jetons d\'Accès Personnel.',
  auth_create_new_oauth_client: 'Créer un nouveau client Oauth dans l\'onglet OAuth, ici :',
  auth_create_new_personal_access_token: 'Créer un nouveau Jeton d\'Accès Personnel dans l\'onglet OAuth, ici :',
  oauth_wrong_token_error_description: 'Échec de la validation de l\'accessToken, veuillez vérifier votre jeton ou l\'URL du backend.',
  transaction_screen_edit_title: 'Modifier la Transaction',
  
  // from 0.9.0
  transaction_form_foreign_currency_label: 'Devise étrangère',
  transaction_form_group_title_label: 'Description de la transaction divisée',
  transaction_form_group_title_placeholder: 'Titre',
  transaction_form_group_title_helper: 'Si vous créez une transaction divisée, il doit y avoir une description globale pour toutes les divisions de la transaction.',
  configuration_review_app_ios: 'Évaluer Abacus sur l\'AppStore',
  configuration_review_app_android: 'Évaluer Abacus sur Google Play',
  
  // from 0.9.2
  assets_history_chart: 'Graphique des comptes',
  balance_history_chart: 'Graphique de la Valeur Nette',
  balance_history_chart_no_data: 'Pour accéder à ce graphique, veuillez mettre à jour FireflyIII à la dernière version.',
  account_not_included_in_net_worth: '* Compte non inclus dans la Valeur Nette.',
  
  // from 0.10.0
  period: 'Période',
  currency: 'Devise',
  
  home_all_accounts: 'Tous les Comptes',
  
  // from 0.10.3
  router_back_button: 'Retour',
  transaction_clone: 'Cloner',
  transaction_delete: 'Supprimer',
  
  // from 0.11.0
  configuration_credentials: 'Identifiants',
  configuration_manage_credentials: 'Gérer les Identifiants',
  configuration_credentials_add_button: 'Ajouter un Identifiant',
  logout: 'Déconnexion',
  
  // from 0.12.0
  credential_clear_confirm_button: 'Supprimer',
  credential_clear_alert_title: 'Êtes-vous sûr ?',
  credential_clear_cancel_button: 'Annuler',
  go_to_credentials: 'Aller aux Identifiants',
  
  configuration_logout_alert_title: 'Déconnexion',
  load_more: 'Charger plus',
  
  // from X.X.X
  home_bills: 'Factures',
  home_piggy_banks: 'Tirelires',
  bills_paid: 'Payé',
  bills_not_expected: 'Non attendu',
  transaction_form_bill_label: 'Facture',
  
};
