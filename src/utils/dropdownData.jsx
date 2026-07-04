export const typeOptions = [
  { value: 'prov', label: 'Healthcare Provider' },
  { value: 'dept', label: 'Hospital Department' },
  { value: 'edu', label: 'Educational Institute' },
  { value: 'bus', label: 'Non-Healthcare Business or Corporation' },
  { value: 'other', label: 'Other' },
];

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export const dateFormatOptions = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
];

export const timeZoneOptions = [
  { value: 'EST', label: 'America/New_York' },
  { value: 'CST', label: 'America/Chicago' },
  { value: 'MST', label: 'America/Denver' },
  { value: 'PST', label: 'America/Los_Angeles' },
  { value: 'AKST', label: 'America/Anchorage' },
  { value: 'HST', label: 'Pacific/Honolulu' },
  { value: 'UTC', label: 'Universal/Time' },
];

export const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Deleted', label: 'Deleted' },
];

export const BOOLEAN_STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Deleted' },
];

export const IS_BOOLEAN_STATUS_OPTIONS = [
  { value: false, label: 'Active' },
  { value: true, label: 'Deleted' },
];

export const BOOLEAN_DEVICE_OPTIONS = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

export const BOOLEAN_POWER_STATE = [
  { value: true, label: 'Yes currently charging' },
  { value: false, label: 'Not currently charging' },
];

export const encounterStatus = [
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const HomeStudyStatus = [
  { value: 'Planned', label: 'Ordered' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const deviceStatus = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'entered-in-error', label: 'Error' },
];

export const deviceAvailabilityStatus = [
  { value: 'lost', label: 'Lost' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'destroyed', label: 'Destroyed' },
  { value: 'available', label: 'Available' },
];

export const manufacturerOptions = [
  { value: 'Integra', label: 'Integra' },
  { value: 'Google-Pixel', label: 'Google-Pixel' },
];

export const US_States = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export const filterType = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const Study_Status = [
  { value: 'Clinical Study', label: 'In Clinic Visits' },
  { value: 'Home Study', label: 'Home Study' },
];

export const timeFormat = [
  { value: '12-Hour-Format', label: '12 Hour Clock (AM/PM)' },
  { value: '24-Hour-Format', label: '24 Hour Clock' },
];
