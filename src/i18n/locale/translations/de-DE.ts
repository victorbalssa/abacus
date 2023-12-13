export default {
  configuration_app_version: 'App Version',
  configuration_about: 'Über',
  configuration_clear_option: 'Inhalte löschen und zurücksetzen',
  configuration_clear_confirm_button: 'Jetzt löschen',
  configuration_clear_alert_title: 'Sind Sie sicher?',
  configuration_clear_alert_text: 'Durch das Löschen des Cache wird Folgendes entfernt:\n'
    + 'lokale Konfigurationen\n'
    + 'Oauth Client ID & Secret\n'
    + 'URL Ihrer Instanz',
  configuration_clear_cancel_button: 'Abbrechen',
  configuration_security: 'Sicherheit',
  configuration_share_feedback: 'Feedback teilen',
  configuration_report_issue: 'Problem melden',
  configuration_sources: 'Quellen',
  configuration_debug: 'Debuggen',
  configuration_get_help: 'Hilfe',
  assetsHistoryCharts_chart_works: 'Dieses Diagramm funktioniert am besten mit bis zu 4 Konten,',
  assetsHistoryCharts_change_preferences: 'Hier Klicken',
  assetsHistoryCharts_choose_preferences_text: 'um Ihre bevorzugten Konten in den Firefly III Einstellungen zu wählen:',
  assetsHistoryCharts_home_screen: 'Startbildschirm',
  transaction_form_description_required: 'Beschreibung ist erforderlich.',
  transaction_form_description_short: 'Die Beschreibung ist zu kurz.',
  transaction_form_amount_required: 'Betrag ist erforderlich.',
  transaction_form_description_label: 'Beschreibung',
  transaction_form_sourceAccount_label: 'Quellkonto',
  transaction_form_destinationAccount_label: 'Zielkonto',
  transaction_form_date_label: 'Datum',
  transaction_form_amount_label: 'Betrag',
  transaction_form_foreign_amount_label: 'Ausländischer Betrag',
  transaction_form_notes_label: 'Notizen',
  transaction_form_category_label: 'Kategorie',
  transaction_form_budget_label: 'Budget',
  transaction_form_tags_label: 'Schlagwörter',
  transaction_form_reset_button: 'Zurücksetzen',
  transaction_form_submit_button: 'Absenden',
  transaction_form_new_split_button: 'Teilung hinzufügen',
  transaction_list_alert_title: 'Sind Sie sicher?',
  transaction_list_alert_text: 'Diese Transaktion wird dauerhaft entfernt:',
  transaction_list_delete_button: 'Löschen',
  transaction_list_cancel_button: 'Abbrechen',
  auth_form_url_label: 'Firefly III Backend URL',
  auth_form_url_help: "ohne '/' am Ende.",
  auth_form_url_placeholder: "Firefly III Backend URL (ohne '/' am Ende)",
  auth_form_oauth_clientId: 'Oauth Client ID',
  auth_form_oauth_client_secret: 'Oauth Client Secret',
  auth_form_secrets_help_message: 'Alle Secrets werden in sicher aufbewahrt.',
  auth_form_set_redirect: 'Umleitungs-URI setzen auf:',
  auth_form_need_help: 'Brauchen Sie Hilfe?',
  auth_form_submit_button_initial: 'Anmelden',
  auth_form_submit_button_loading: 'Senden...',
  auth_form_biometrics_lock: 'Biometrische Sperre',
  home_accounts: 'Konten',
  layout_new_update_header: 'Neue Aktualisierung verfügbar',
  layout_new_update_body_text: 'Sie können später jederzeit unter Einstellungen aktualisieren.',
  layout_new_update_cancel_button: 'Abbrechen',
  layout_new_update_update_button: 'Jetzt aktualisieren',

  // from version 0.31
  transaction_screen_title: 'Neue Transaktion',
  navigation_home_tab: 'Startseite',
  navigation_chart_tab: 'Diagramm',
  navigation_create_tab: 'Erstellen',
  navigation_transactions_tab: 'Vorgänge',
  navigation_settings_tab: 'Einstellungen',
  transaction_form_type_withdraw: 'Ausgabe',
  transaction_form_type_deposit: 'Einnahme',
  transaction_form_type_transfer: 'Überweisung',

  // from 0.4.1
  period_switcher_monthly: 'Monatlich',
  period_switcher_quarterly: 'Quartalsweise',
  period_switcher_semiannually: 'Halbjährlich',
  period_switcher_yearly: 'Jährlich',
  error_widget_title: 'Etwas ist schief gelaufen',
  home_container_error_title: 'Etwas ist schief gelaufen',
  home_container_error_description: 'AccessToken konnte nicht abgerufen werden',
  oauth_token_error_title: 'Etwas ist schief gelaufen',
  oauth_token_error_description: 'AccessToken konnte nicht abgerufen werden',
  oauth_token_info_title: 'Info',
  oauth_token_info_description: 'Authentifizierung abgebrochen, Client-ID und Backend-URL prüfen.',
  oauth_token_success_title: 'Erfolgreich',
  oauth_token_success_description: 'Sichere Verbindung mit Ihrer Firefly III-Instanz hergestellt.',
  transaction_form_success_title: 'Erfolgreich',
  transaction_form_success_description: 'Transaktion erstellt. Tippen Sie hier, um zur Transaktionsliste zu gelangen.',
  transaction_form_error_title: 'Fehler',
  home_header_time_range_year: 'Jahr',
  home_header_time_range_q: 'Q', // Geben Sie eine Abkürzung ein, die ein Quartal am besten repräsentiert
  home_header_time_range_s: 'H', // Setzen Sie eine Abkürzung ein, die am besten ein Halbjahresdatum repräsentiert

  // from 0.6.0
  balance: 'Bilanz',
  history: 'Historie',
  home_categories: 'Kategorien',
  home_net_worth: 'Nettowert',

  // from 0.7.0
  home_budgets: 'Budgets',
  configuration_ui: 'Benutzeroberfläche',
  configuration_color_mode: 'Dark Mode',
  auth_form_personal_access_token_label: 'Persönliches Zugangstoken',
  auth_use_personal_access_token: 'Persönliches Zugangstoken verwenden',
  auth_external_heads_up: '❗️ Wenn Sie einen externen Authentifizierungsanbieter wie Authelia, Keycloak, Cloudflare Tunnels, etc. verwenden werden diese Clients nicht funktionieren. Sie können nur Personal Access Tokens verwenden.',
  auth_create_new_oauth_client: 'Erstellen Sie einen neuen OAuth-Client auf der Registerkarte OAuth, hier:',
  auth_create_new_personal_access_token: 'Erstellen Sie ein neues Personal Access Token auf der Registerkarte OAuth, hier:',
  oauth_wrong_token_error_description: 'AccessToken konnte nicht validiert werden, bitte überprüfen Sie Ihr Token oder Ihre Backend-URL erneut.',
  transaction_screen_edit_title: 'Transaktion bearbeiten',

  // from 0.9.0
  transaction_form_foreign_currency_label: 'Ausländischer Betrag',
  transaction_form_group_title_label: 'Beschreibung der geteilten Transaktion',
  transaction_form_group_title_placeholder: 'Beschreibung',
  transaction_form_group_title_helper: 'Wenn Sie eine geteilte Transaktion erstellen, muss eine allgmeine Beschreibung für die geteile Transaktion vorhanden sein.',
  configuration_review_app_ios: 'Bewerte Abacus im AppStore',
  configuration_review_app_android: 'Bewerte Abacus im Google Play',

  // from 0.9.2
  assets_history_chart: 'Kontendiagramm',
  balance_history_chart: 'Vermögensdiagramm',
  balance_history_chart_no_data: 'Um auf dieses Diagramm zugreifen zu können, aktualisieren Sie bitte FireflyIII auf die neueste Version.',
  account_not_included_in_net_worth: '* Konten nicht im Nettovermögen enthalten.',

  // from 0.10.0
  period: 'Zeitraum',
  currency: 'Währung',

  home_all_accounts: 'Alle Konten',
};
