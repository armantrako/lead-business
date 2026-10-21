export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  cities: string[];
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'BA',
    name: 'Bosna i Hercegovina',
    flag: '🇧🇦',
    cities: [
      'Sarajevo',
      'Banja Luka',
      'Mostar',
      'Tuzla',
      'Zenica',
      'Bijeljina',
      'Bihać',
      'Trebinje',
      'Brčko',
      'Travnik',
    ],
  },
];

export function getCitiesByCountry(countryName: string = 'Bosna i Hercegovina'): string[] {
  const country = SUPPORTED_COUNTRIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase() || c.code.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.cities : SUPPORTED_COUNTRIES[0].cities;
}
