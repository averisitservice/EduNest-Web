const timezones = {
  US: [
    { label: 'Eastern Time - EST', value: 'America/New_York' },
    { label: 'Central Time - CST', value: 'America/Chicago' },
    { label: 'Mountain Time - MST', value: 'America/Denver' },
    { label: 'Arizona Time - MST (no DST)', value: 'America/Phoenix' },
    { label: 'Pacific Time - PST', value: 'America/Los_Angeles' },
    { label: 'Alaska Time - AKST', value: 'America/Anchorage' },
    { label: 'Hawaii Time - HAST', value: 'Pacific/Honolulu' },
  ],
  IN: [{ label: 'Calcutta (Asia)', value: 'Asia/Calcutta' }],
  GB: [{ label: 'London (Europe)', value: 'Europe/London' }],
  AU: [
    { label: 'Sydney (Australia)', value: 'Australia/Sydney' },
    { label: 'Melbourne (Australia)', value: 'Australia/Melbourne' },
    { label: 'Brisbane (Australia)', value: 'Australia/Brisbane' },
    { label: 'Perth (Australia)', value: 'Australia/Perth' },
  ],
  JP: [{ label: 'Tokyo (Asia)', value: 'Asia/Tokyo' }],
  CN: [
    { label: 'Shanghai (Asia)', value: 'Asia/Shanghai' },
    { label: 'Urumqi (Asia)', value: 'Asia/Urumqi' },
  ],
  BR: [
    { label: 'Sao Paulo (America)', value: 'America/Sao_Paulo' },
    { label: 'Manaus (America)', value: 'America/Manaus' },
    { label: 'Fortaleza (America)', value: 'America/Fortaleza' },
  ],
  RU: [
    { label: 'Moscow (Europe)', value: 'Europe/Moscow' },
    { label: 'Vladivostok (Asia)', value: 'Asia/Vladivostok' },
    { label: 'Novosibirsk (Asia)', value: 'Asia/Novosibirsk' },
  ],
  CA: [
    { label: 'Toronto (America)', value: 'America/Toronto' },
    { label: 'Vancouver (America)', value: 'America/Vancouver' },
    { label: 'Halifax (America)', value: 'America/Halifax' },
  ],
};

export { timezones };
