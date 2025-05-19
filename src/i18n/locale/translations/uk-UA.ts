export default {
    configuration_app_version: 'Версія застосунку',
    configuration_about: 'Про застосунок',
    configuration_clear_option: 'Очистити і скинути застосунок',
    configuration_clear_confirm_button: 'Очистити зараз',
    configuration_clear_alert_title: 'Ви впевнені?',
    configuration_clear_alert_text: 'Очищення кешу видалить:\n'
        + 'Локальні налаштування\n'
        + 'Oauth Client ID та Secret\n'
        + 'URL вашого екземпляра',
    cancel: 'Скасувати',
    configuration_security: 'Безпека',
    configuration_share_feedback: 'Залишити відгук',
    configuration_report_issue: 'Повідомити про проблему',
    configuration_sources: 'Джерело',
    configuration_debug: 'Налагодження',
    configuration_get_help: 'Отримати допомогу',
    assetsHistoryCharts_chart_works: 'Ця діаграма найкраще працює з чотирма обліковими записами.',
    assetsHistoryCharts_change_preferences: 'натисніть тут',
    assetsHistoryCharts_choose_preferences_text: 'щоб вибрати облікові записи в налаштуваннях Firefly III:',
    assetsHistoryCharts_home_screen: 'Головний екран',
    transaction_form_description_required: 'Потрібен опис.',
    transaction_form_description_short: 'Опис занадто короткий.',
    transaction_form_amount_required: 'Потрібна сума.',
    transaction_form_description_label: 'Опис',
    transaction_form_sourceAccount_label: 'Рахунок джерела',
    transaction_form_destinationAccount_label: 'Рахунок призначення',
    transaction_form_date_label: 'Дата',
    transaction_form_amount_label: 'Сума',
    transaction_form_foreign_amount_label: 'Іноземна валюта',
    transaction_form_notes_label: 'Нотатки',
    transaction_form_category_label: 'Категорія',
    transaction_form_budget_label: 'Бюджет',
    transaction_form_tags_label: 'Теги',
    transaction_form_reset_button: 'Скинути',
    transaction_form_submit_button: 'Надіслати',
    transaction_form_new_split_button: 'Додати поділ',
    transaction_list_alert_title: 'Ви впевнені?',
    transaction_list_alert_text: 'Ця транзакція буде остаточно видалена:',
    transaction_list_delete_button: 'Видалити',
    transaction_list_cancel_button: 'Скасувати',
    auth_form_url_label: 'URL бекенду Firefly III',
    auth_form_url_help: "без '/' в кінці.",
    auth_form_url_placeholder: "URL бекенду Firefly III (без '/' в кінці)",
    auth_form_oauth_clientId: 'Oauth Client ID',
    auth_form_oauth_client_secret: 'Oauth Client Secret',
    auth_form_secrets_help_message: 'Усі ключі зберігаються в безпечному місці.',
    auth_form_set_redirect: 'Встановіть URI перенаправлення на:',
    auth_form_need_help: 'Потрібна допомога?',
    auth_form_submit_button_initial: 'Увійти',
    auth_form_submit_button_loading: 'Надсилання...',
    auth_form_biometrics_lock: 'Біометричний замок',
    home_accounts: 'Рахунки активів',
    layout_new_update_header: 'Доступне нове оновлення',
    layout_new_update_body_text: 'Ви завжди можете оновити пізніше на вкладці «Налаштування».',
    layout_new_update_cancel_button: 'Скасувати',
    layout_new_update_update_button: 'Оновити зараз',

    // from version 0.31
    transaction_screen_title: 'Нова транзакція',
    navigation_home_tab: 'Головна',
    navigation_chart_tab: 'Графік',
    navigation_create_tab: 'Створити',
    navigation_transactions_tab: 'Транзакції',
    navigation_settings_tab: 'Налаштування',
    transaction_form_type_withdrawal: 'Витрата',
    transaction_form_type_deposit: 'Надходження',
    transaction_form_type_transfer: 'Переказ',

    // from 0.4.1
    period_switcher_monthly: 'Щомісячно',
    period_switcher_quarterly: 'Щоквартально',
    period_switcher_semiannually: 'Раз на пів року',
    period_switcher_yearly: 'Щорічно',
    error_widget_title: 'Щось пішло не так',
    home_container_error_title: 'Щось пішло не так',
    home_container_error_description: 'Не вдалося отримати токен доступу',
    oauth_token_error_title: 'Щось пішло не так',
    oauth_token_error_description: 'Не вдалося отримати токен доступу',
    oauth_token_info_title: 'Інформація',
    oauth_token_info_description: 'Аутентифікацію скасовано, перевірте Client ID та URL бекенду.',
    oauth_token_success_title: 'Успішно',
    oauth_token_success_description: 'Безпечне з’єднання з вашим екземпляром Firefly III встановлено.',
    transaction_form_success_title: 'Успішно',
    transaction_form_success_description: 'Транзакція створена. Натисніть тут, щоб перейти до списку транзакцій.',
    transaction_form_error_title: 'Помилка',
    home_header_time_range_year: 'Рік',
    home_header_time_range_q: 'Кв.', // Квартал
    home_header_time_range_s: 'Півр.', // Півріччя

    // from 0.6.0
    balance: 'Баланс',
    history: 'Історія',
    home_categories: 'Категорії',
    home_net_worth: 'Чисті активи',

    // from 0.7.0
    home_budgets: 'Бюджети',
    configuration_ui: 'Інтерфейс користувача',
    configuration_color_mode: 'Темна тема',
    auth_form_personal_access_token_label: 'Особистий токен доступу',
    auth_use_personal_access_token: 'Використовуйте особистий токен доступу',
    auth_external_heads_up: '❗️Якщо ви використовуєте зовнішній сервіс аутентифікації, такий як Authelia, Keycloak, Cloudflare Tunnels тощо, клієнти OAuth не працюватимуть. Можна використовувати лише особисті токени доступу.',
    auth_create_new_oauth_client: 'Створіть нового клієнта OAuth на вкладці OAuth тут:',
    auth_create_new_personal_access_token: 'Створіть новий особистий токен доступу на вкладці OAuth тут:',
    oauth_wrong_token_error_description: 'Не вдалося перевірити accessToken. Перевірте ваш токен або URL серверної частини.',
    transaction_screen_edit_title: 'Редагувати транзакцію',

    // from 0.9.0
    transaction_form_foreign_currency_label: 'Іноземна валюта',
    transaction_form_group_title_label: 'Опис поділеної транзакції',
    transaction_form_group_title_placeholder: 'Назва',
    transaction_form_group_title_helper: 'Якщо ви створюєте поділену транзакцію, потрібно вказати загальний опис.',
    configuration_review_app_ios: 'Огляд Abacus в AppStore',
    configuration_review_app_android: 'Огляд Abacus в Google Play',

    // from 0.9.2
    assets_history_chart: 'Діаграма рахунків',
    balance_history_chart: 'Діаграма чистих активів',
    balance_history_chart_no_data: 'Щоб переглядати цю діаграму, оновіть Firefly III до останньої версії.',
    account_not_included_in_net_worth: '* Рахунок не враховується у чистих активах.',

    // from 0.10.0
    period: 'Період',
    currency: 'Валюта',

    home_all_accounts: 'Усі рахунки',

    // from 0.10.3
    router_back_button: 'Назад',
    transaction_clone: 'Клонувати',
    transaction_delete: 'Видалити',

    // from 0.11.0
    configuration_credentials: 'Облікові дані',
    configuration_manage_credentials: 'Керування обліковими даними',
    configuration_credentials_add_button: 'Додати облікові дані',
    logout: 'Вийти',

    // from 0.12.0
    credential_clear_confirm_button: 'Видалити',
    credential_clear_alert_title: 'Ви впевнені?',
    credential_clear_cancel_button: 'Скасувати',
    go_to_credentials: 'До облікових даних',

    configuration_logout_alert_title: 'Вихід',
    load_more: 'Завантажити більше',

    // from X.X.X
    home_bills: 'Рахунки',
    bills_paid: 'Сплачено до',
    due_by: 'Термін до',
    date_unavailable: 'сповіщення',
    bills_not_expected: 'Не очікується',
    transaction_form_bill_label: 'Рахунок',

    // from 0.19.0
    configuration_theme: 'Тема',
    configuration_theme_selection: 'Змінити тему',
    configuration_theme_title: 'Кольорові теми',
};
