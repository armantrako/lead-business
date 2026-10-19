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
  {
    code: 'HR',
    name: 'Hrvatska',
    flag: '🇭🇷',
    cities: [
      'Zagreb',
      'Split',
      'Rijeka',
      'Osijek',
      'Zadar',
      'Dubrovnik',
      'Pula',
      'Šibenik',
    ],
  },
  {
    code: 'RS',
    name: 'Srbija',
    flag: '🇷🇸',
    cities: [
      'Beograd',
      'Novi Sad',
      'Niš',
      'Kragujevac',
      'Subotica',
      'Zrenjanin',
      'Pančevo',
    ],
  },
  {
    code: 'ME',
    name: 'Crna Gora',
    flag: '🇲🇪',
    cities: [
      'Podgorica',
      'Budva',
      'Bar',
      'Nikšić',
      'Kotor',
      'Herceg Novi',
    ],
  },
];

export function getCitiesByCountry(countryName: string): string[] {
  if (!countryName || countryName === 'all') {
    const allCities = new Set<string>();
    SUPPORTED_COUNTRIES.forEach((c) => c.cities.forEach((city) => allCities.add(city)));
    return Array.from(allCities).sort();
  }
  const country = SUPPORTED_COUNTRIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase() || c.code.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.cities : [];
}
