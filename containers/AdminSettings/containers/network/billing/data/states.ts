const states = (country: string): Array<string> => {
  if (country === 'US') {
    return [
      'Alaska',
      'Alabama',
      'Arkansas',
      'Arizona',
      'California',
      'Colorado',
      'Connecticut',
      'District of Columbia',
      'Delaware',
      'Florida',
      'Georgia',
      'Hawaii',
      'Iowa',
      'Idaho',
      'Illinois',
      'Indiana',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Massachusetts',
      'Maryland',
      'Maine',
      'Michigan',
      'Minnesota',
      'Missouri',
      'Mississippi',
      'Montana',
      'North Carolina',
      'North Dakota',
      'Nebraska',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'Nevada',
      'New York',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Pennsylvania',
      'Puerto Rico',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Virginia',
      'Vermont',
      'Washington',
      'Wisconsin',
      'West Virginia',
      'Wyoming',
    ]
  }

  if (country === 'CA') {
    return [
      'Alberta',
      'British Columbia',
      'Manitoba',
      'New Brunswick',
      'Newfoundland',
      'Northwest Territories',
      'Nova Scotia',
      'Nunavut',
      'Ontario',
      'Prince Edward Island',
      'Quebec',
      'Saskatchewan',
      'Yukon Territory',
    ]
  }

  return []
}

export default states
