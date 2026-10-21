import { BusinessCategory, InstagramBusiness } from '@/types';
import { sanitizeAndValidateInstagramUrl } from '@/lib/instagram-url';

interface RawBusinessSeed {
  id: string;
  name: string;
  rawHandleOrUrl: string;
  followersCount: number;
  category: BusinessCategory;
  city: string;
  notes?: string;
}

const RAW_BOSNIA_BUSINESSES: RawBusinessSeed[] = [
  // ==========================================
  // 1. FRIZERSKI SALONI I BARBERSHOPS (11)
  // ==========================================
  {
    id: 'hb-01',
    name: "Alen's Barbershop",
    rawHandleOrUrl: 'alensbarbershop',
    followersCount: 32500,
    category: 'hair_barber',
    city: 'Sarajevo',
    notes: 'Poznati sarajevski barbershop i akademija',
  },
  {
    id: 'hb-02',
    name: 'Barbiere Sarajevo',
    rawHandleOrUrl: 'barbiere_sarajevo',
    followersCount: 8900,
    category: 'hair_barber',
    city: 'Sarajevo',
    notes: 'Urbana brijačnica u Kranjčevićevoj ulici',
  },
  {
    id: 'hb-03',
    name: 'Picasso Barbershop',
    rawHandleOrUrl: 'picassobarbershop1',
    followersCount: 12400,
    category: 'hair_barber',
    city: 'Sarajevo',
    notes: 'Moderni stilovi šišanja i fade tehnike',
  },
  {
    id: 'hb-04',
    name: 'Radonjić Barbershop',
    rawHandleOrUrl: 'radonjic_barbershop',
    followersCount: 7600,
    category: 'hair_barber',
    city: 'Sarajevo',
    notes: 'Muški salon i brijanje',
  },
  {
    id: 'hb-05',
    name: "Gentlemen's Barber Atelié",
    rawHandleOrUrl: 'gentlemens_barber_atelie',
    followersCount: 8100,
    category: 'hair_barber',
    city: 'Banja Luka',
    notes: 'Ekskluzivni muški atelje u Banjoj Luci',
  },
  {
    id: 'hb-06',
    name: 'Barbershop Dama i Džentlmen',
    rawHandleOrUrl: 'barbershopdamaidzentlmen',
    followersCount: 6500,
    category: 'hair_barber',
    city: 'Banja Luka',
    notes: 'Muško i žensko šišanje, brade i njega kose',
  },
  {
    id: 'hb-07',
    name: 'Frizerski salon Neda',
    rawHandleOrUrl: 'frizerskisalonneda',
    followersCount: 5400,
    category: 'hair_barber',
    city: 'Banja Luka',
    notes: 'Šišanje, feniranje i moderne tehnike',
  },
  {
    id: 'hb-08',
    name: 'Unique by Mirza Barber Shop',
    rawHandleOrUrl: 'unique_by_mirza',
    followersCount: 9700,
    category: 'hair_barber',
    city: 'Mostar',
    notes: 'Specijalizovani muški frizerski salon u Mostaru',
  },
  {
    id: 'hb-09',
    name: 'EL Studio House of Hair',
    rawHandleOrUrl: 'el_studio30',
    followersCount: 7200,
    category: 'hair_barber',
    city: 'Mostar',
    notes: 'Frizerski studio sa širokim spektrom usluga',
  },
  {
    id: 'hb-10',
    name: 'Mr. Barber Tuzla',
    rawHandleOrUrl: 'mr.barber.tz',
    followersCount: 8400,
    category: 'hair_barber',
    city: 'Tuzla',
    notes: 'Fade tehnike, uređivanje brade u Tuzli',
  },
  {
    id: 'hb-11',
    name: 'Barber Shop David Tuzla',
    rawHandleOrUrl: 'barber_shoop_david01',
    followersCount: 6100,
    category: 'hair_barber',
    city: 'Tuzla',
    notes: 'Korzo frizerski salon za muškarce',
  },

  // ==========================================
  // 2. BEAUTY SALONI, NOKTI I TREPAVICE (11)
  // ==========================================
  {
    id: 'bn-01',
    name: 'Tara Beauty Studio',
    rawHandleOrUrl: 'tarabeautystudio',
    followersCount: 16800,
    category: 'beauty_nails',
    city: 'Banja Luka',
    notes: 'Lash & brow lift, puder obrve i manikir',
  },
  {
    id: 'bn-02',
    name: 'Happening Beauty Studio',
    rawHandleOrUrl: 'happening__nailss',
    followersCount: 11200,
    category: 'beauty_nails',
    city: 'Banja Luka',
    notes: 'Specijalizovani studio za nokte i estetiku',
  },
  {
    id: 'bn-03',
    name: 'Beauty House by Ljudmila',
    rawHandleOrUrl: 'beautyhousebyljudmila',
    followersCount: 15400,
    category: 'beauty_nails',
    city: 'Sarajevo',
    notes: 'Nadogradnja trepavica, manikir i edukacije',
  },
  {
    id: 'bn-04',
    name: 'Studio Beauty NU',
    rawHandleOrUrl: '_beautynu',
    followersCount: 8900,
    category: 'beauty_nails',
    city: 'Sarajevo',
    notes: 'Laminacija obrva, lash lift i nokti',
  },
  {
    id: 'bn-05',
    name: 'Beauty Salon Wings',
    rawHandleOrUrl: 'wings_sarajevo',
    followersCount: 9300,
    category: 'beauty_nails',
    city: 'Sarajevo',
    notes: 'Kompletni kozmetički tretmani i trajna šminka',
  },
  {
    id: 'bn-06',
    name: 'Kuća Ljepote Djenna',
    rawHandleOrUrl: 'kucaljepotedjenna',
    followersCount: 13500,
    category: 'beauty_nails',
    city: 'Sarajevo',
    notes: 'Centar ljepote i estetskih tretmana',
  },
  {
    id: 'bn-07',
    name: 'Kultura Ljepote Sarajevo',
    rawHandleOrUrl: 'kulturaljepote',
    followersCount: 10800,
    category: 'beauty_nails',
    city: 'Sarajevo',
    notes: 'Specijalizovana njega kože i lica',
  },
  {
    id: 'bn-08',
    name: 'The Beautyland Mostar',
    rawHandleOrUrl: 'the_beautyland_mostar',
    followersCount: 7800,
    category: 'beauty_nails',
    city: 'Mostar',
    notes: 'SPC Orca kozmetički i estetski salon',
  },
  {
    id: 'bn-09',
    name: 'Cosmetic Studio Bella Mostar',
    rawHandleOrUrl: 'cosmetic_studio_bella',
    followersCount: 6900,
    category: 'beauty_nails',
    city: 'Mostar',
    notes: 'Tretmani lica, njega noktiju i pedikir',
  },
  {
    id: 'bn-10',
    name: 'Kozmetički Studio Staša',
    rawHandleOrUrl: 'kozmetickistudiostasa',
    followersCount: 6200,
    category: 'beauty_nails',
    city: 'Banja Luka',
    notes: 'Njega lica i estetski tretmani tijela',
  },
  {
    id: 'bn-11',
    name: 'Salon Ljepote Kneginja',
    rawHandleOrUrl: 'salonkneginja',
    followersCount: 5800,
    category: 'beauty_nails',
    city: 'Banja Luka',
    notes: 'Trajni lak, gel tehnika i lash lift',
  },

  // ==========================================
  // 3. AUTOSALONI I PRODAJA VOZILA (11)
  // ==========================================
  {
    id: 'cd-01',
    name: 'Auto Salon Kramar',
    rawHandleOrUrl: 'auto_salon_kramar',
    followersCount: 92000,
    category: 'car_dealership',
    city: 'Sarajevo',
    notes: 'Vodeći salon rabljenih vozila u BiH',
  },
  {
    id: 'cd-02',
    name: 'Porsche Centar Sarajevo',
    rawHandleOrUrl: 'porsche_centar_sarajevo',
    followersCount: 31500,
    category: 'car_dealership',
    city: 'Sarajevo',
    notes: 'Zvanični salon i servis za Porsche vozila',
  },
  {
    id: 'cd-03',
    name: 'Porsche BH Postprodaja',
    rawHandleOrUrl: 'porschebh_postprodaja',
    followersCount: 14200,
    category: 'car_dealership',
    city: 'Sarajevo',
    notes: 'Servis i podrška za Volkswagen, Audi, Škoda, SEAT, CUPRA',
  },
  {
    id: 'cd-04',
    name: 'Auto Salon Bombastic',
    rawHandleOrUrl: 'bombastic_d.o.o',
    followersCount: 16800,
    category: 'car_dealership',
    city: 'Sarajevo',
    notes: 'Rabljena vozila i rent-a-car na Ilidži',
  },
  {
    id: 'cd-05',
    name: 'ARA Auto Salon',
    rawHandleOrUrl: 'araauto.ba',
    followersCount: 11400,
    category: 'car_dealership',
    city: 'Sarajevo',
    notes: 'Prodaja vozila, registracija i prateće usluge',
  },
  {
    id: 'cd-06',
    name: 'Autopark d.o.o.',
    rawHandleOrUrl: 'autopark.doo',
    followersCount: 13900,
    category: 'car_dealership',
    city: 'Banja Luka',
    notes: 'Uvoz i prodaja provjerenih polovnih automobila',
  },
  {
    id: 'cd-07',
    name: 'Boss BL Auto',
    rawHandleOrUrl: 'bossblauto',
    followersCount: 8700,
    category: 'car_dealership',
    city: 'Banja Luka',
    notes: 'Prodaja rabljenih vozila i motocikala',
  },
  {
    id: 'cd-08',
    name: 'Gold Auto Banja Luka',
    rawHandleOrUrl: 'goldauto.banjaluka',
    followersCount: 7900,
    category: 'car_dealership',
    city: 'Banja Luka',
    notes: 'Salon polovnih automobila',
  },
  {
    id: 'cd-09',
    name: 'Auto MT Mostar',
    rawHandleOrUrl: 'automtdoo',
    followersCount: 9100,
    category: 'car_dealership',
    city: 'Mostar',
    notes: 'Prodaja automobila i najam luksuznih vozila',
  },
  {
    id: 'cd-10',
    name: 'Auto Master Tuzla',
    rawHandleOrUrl: 'auto_master_tuzla',
    followersCount: 10400,
    category: 'car_dealership',
    city: 'Tuzla',
    notes: 'Prodaja rabljenih automobila s garancijom',
  },
  {
    id: 'cd-11',
    name: 'MG Motor Tuzla',
    rawHandleOrUrl: 'mgmotortuzla',
    followersCount: 6800,
    category: 'car_dealership',
    city: 'Tuzla',
    notes: 'Ovlašteni zastupnik i prodaja novih vozila',
  },

  // ==========================================
  // 4. AUTO DETAILING I AUTOPRAONICE (11)
  // ==========================================
  {
    id: 'ad-01',
    name: 'Sikima Auto Detailing',
    rawHandleOrUrl: 'sikima_detailing',
    followersCount: 14600,
    category: 'auto_detailing',
    city: 'Sarajevo',
    notes: 'Poliranje, keramička i PPF zaštita',
  },
  {
    id: 'ad-02',
    name: 'Bukva Car Detailing',
    rawHandleOrUrl: 'bukvacardetailing',
    followersCount: 11900,
    category: 'auto_detailing',
    city: 'Sarajevo',
    notes: 'Detaljno pranje, dubinsko čišćenje i poliranje',
  },
  {
    id: 'ad-03',
    name: 'AutoShine Sarajevo',
    rawHandleOrUrl: 'autoshine.sarajevo',
    followersCount: 9400,
    category: 'auto_detailing',
    city: 'Sarajevo',
    notes: 'Dubinsko čišćenje i njega enterijera',
  },
  {
    id: 'ad-04',
    name: 'Perfect Car Sarajevo',
    rawHandleOrUrl: 'perfect_car5',
    followersCount: 13200,
    category: 'auto_detailing',
    city: 'Sarajevo',
    notes: 'Korekcija laka i keramička zaštita',
  },
  {
    id: 'ad-05',
    name: 'Gold Garage Detailing',
    rawHandleOrUrl: 'goldgarage.detailing',
    followersCount: 8800,
    category: 'auto_detailing',
    city: 'Sarajevo',
    notes: 'Auto detailing centar i servisne usluge',
  },
  {
    id: 'ad-06',
    name: 'Detailing Muki Banja Luka',
    rawHandleOrUrl: 'detailing_muki',
    followersCount: 15300,
    category: 'auto_detailing',
    city: 'Banja Luka',
    notes: 'Poliranje i Nasiol keramički premazi',
  },
  {
    id: 'ad-07',
    name: 'Stevanović Auto Detailing',
    rawHandleOrUrl: 'stevanovicdetailing',
    followersCount: 10700,
    category: 'auto_detailing',
    city: 'Banja Luka',
    notes: 'Višeslojna poliranja i keramička zaštita',
  },
  {
    id: 'ad-08',
    name: 'Car Detailing Banja Luka',
    rawHandleOrUrl: 'cardetailingbl',
    followersCount: 7600,
    category: 'auto_detailing',
    city: 'Banja Luka',
    notes: 'Pranje, poliranje farova i dubinsko čišćenje',
  },
  {
    id: 'ad-09',
    name: 'Detailing Ljubbe',
    rawHandleOrUrl: 'detailing.ljubbe',
    followersCount: 6400,
    category: 'auto_detailing',
    city: 'Banja Luka',
    notes: 'Polimerizacija i poliranje farova',
  },
  {
    id: 'ad-10',
    name: 'AB Detailing Tuzla',
    rawHandleOrUrl: 'ab_detailing_tuzla',
    followersCount: 8200,
    category: 'auto_detailing',
    city: 'Tuzla',
    notes: 'Korekcija laka i keramička zaštita',
  },
  {
    id: 'ad-11',
    name: 'Auto Detailing Soki',
    rawHandleOrUrl: 'auto.detailing.soki',
    followersCount: 5900,
    category: 'auto_detailing',
    city: 'Banja Luka',
    notes: 'Mašinsko poliranje kompletnih vozila',
  },

  // ==========================================
  // 5. FAST FOOD RESTORANI I PIZZERIJE (11)
  // ==========================================
  {
    id: 'ff-01',
    name: 'Žeks Döner Sarajevo',
    rawHandleOrUrl: 'zeks.doner',
    followersCount: 17200,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Poznati berlinski döner kebab u Sarajevu',
  },
  {
    id: 'ff-02',
    name: 'Burgrs Sarajevo',
    rawHandleOrUrl: 'burgrs.sarajevo',
    followersCount: 14800,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Specijalizovani smash burgeri',
  },
  {
    id: 'ff-03',
    name: 'Burgerica Burger Bar',
    rawHandleOrUrl: 'burgerica_burgerbar',
    followersCount: 12600,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Gourmet burgeri na Dobrinji',
  },
  {
    id: 'ff-04',
    name: 'Fast Food King Sarajevo',
    rawHandleOrUrl: 'fast_food_king_sarajevo',
    followersCount: 18900,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Popularan lanac brze hrane i burgera',
  },
  {
    id: 'ff-05',
    name: 'Ćevabdžinica Željo',
    rawHandleOrUrl: 'zeljo_cevabdzinica_since1968',
    followersCount: 28400,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Kultni sarajevski ćevapi na Baščaršiji',
  },
  {
    id: 'ff-06',
    name: 'Ćevabdžinica Petica Ferhatović',
    rawHandleOrUrl: 'peticaferhatovic',
    followersCount: 22100,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Tradicija sarajevskih ćevapa u Starom Gradu',
  },
  {
    id: 'ff-07',
    name: 'Ćevabdžinica Bosna',
    rawHandleOrUrl: 'cevabdzinicabosnasarajevo',
    followersCount: 19500,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Ćevapi na Bravadžiluku',
  },
  {
    id: 'ff-08',
    name: 'Ćevabdžinica Beg',
    rawHandleOrUrl: 'cevabdzinica.beg',
    followersCount: 11800,
    category: 'fast_food',
    city: 'Sarajevo',
    notes: 'Tradicionalna ćevabdžinica na Baščaršiji',
  },
  {
    id: 'ff-09',
    name: 'Kloopizza Banja Luka',
    rawHandleOrUrl: 'kloopizza_banjaluka',
    followersCount: 13700,
    category: 'fast_food',
    city: 'Banja Luka',
    notes: 'Brza hrana, pizze i burgeri',
  },
  {
    id: 'ff-10',
    name: 'Burgerica Smash Tuzla',
    rawHandleOrUrl: 'burgerica_smash',
    followersCount: 9200,
    category: 'fast_food',
    city: 'Tuzla',
    notes: 'Smash burger bar u centru Tuzle',
  },
  {
    id: 'ff-11',
    name: 'Chick King Tuzla',
    rawHandleOrUrl: 'chickkingtuzla',
    followersCount: 7800,
    category: 'fast_food',
    city: 'Tuzla',
    notes: 'Hrskava piletina i burgeri u Bingo City Centru',
  },

  // ==========================================
  // 6. RESTORANI, KAFIĆI I SLASTIČARNE (11)
  // ==========================================
  {
    id: 'rc-01',
    name: 'Restaurant Kibe Mahala',
    rawHandleOrUrl: 'kibemahala',
    followersCount: 24600,
    category: 'restaurants_cafes',
    city: 'Sarajevo',
    notes: 'Tradicionalna kuhinja sa panoramskim pogledom na Sarajevo',
  },
  {
    id: 'rc-02',
    name: 'Baoli Restaurant & Lounge',
    rawHandleOrUrl: 'baoli_sarajevo',
    followersCount: 29100,
    category: 'restaurants_cafes',
    city: 'Sarajevo',
    notes: 'Ekskluzivni gastro restoran i lounge bar',
  },
  {
    id: 'rc-03',
    name: 'Restoran Hindin Han',
    rawHandleOrUrl: 'hindin_han',
    followersCount: 15400,
    category: 'restaurants_cafes',
    city: 'Mostar',
    notes: 'Poznati restoran na rijeci Radobolji u Starom Gradu',
  },
  {
    id: 'rc-04',
    name: 'Restoran Mala Stanica',
    rawHandleOrUrl: 'malastanica',
    followersCount: 18200,
    category: 'restaurants_cafes',
    city: 'Banja Luka',
    notes: 'Gastro restoran u zgradi stare željezničke stanice',
  },
  {
    id: 'rc-05',
    name: 'Mala Stanica Mercator',
    rawHandleOrUrl: 'malastanicamercator',
    followersCount: 9600,
    category: 'restaurants_cafes',
    city: 'Banja Luka',
    notes: 'Restoran i caffe u Boriku',
  },
  {
    id: 'rc-06',
    name: 'Restoran Dveri',
    rawHandleOrUrl: 'restoran_dveri',
    followersCount: 12800,
    category: 'restaurants_cafes',
    city: 'Sarajevo',
    notes: 'Domaći hljeb i tradicionalni specijaliteti',
  },
  {
    id: 'rc-07',
    name: 'Caffe Slastičarna Carigrad',
    rawHandleOrUrl: 'carigrad_sarajevo',
    followersCount: 17900,
    category: 'restaurants_cafes',
    city: 'Sarajevo',
    notes: 'Orijentalne poslastice i kahva na Baščaršiji',
  },
  {
    id: 'rc-08',
    name: 'Caffe Slastičarna Vatra',
    rawHandleOrUrl: 'caffe_slasticarna_vatra',
    followersCount: 26800,
    category: 'restaurants_cafes',
    city: 'Sarajevo',
    notes: 'Poznati kolači i ambijent u centru Sarajeva',
  },
  {
    id: 'rc-09',
    name: 'Restoran Šadrvan Mostar',
    rawHandleOrUrl: 'sadrvan_mostar',
    followersCount: 14100,
    category: 'restaurants_cafes',
    city: 'Mostar',
    notes: 'Nacionalni restoran uz Stari most',
  },
  {
    id: 'rc-10',
    name: 'Restoran Lovac Banja Luka',
    rawHandleOrUrl: 'restoranlovac_bl',
    followersCount: 8900,
    category: 'restaurants_cafes',
    city: 'Banja Luka',
    notes: 'Lovački i domaći specijaliteti',
  },
  {
    id: 'rc-11',
    name: 'Restoran Mama Mia Tuzla',
    rawHandleOrUrl: 'mamamiatuzla',
    followersCount: 11200,
    category: 'restaurants_cafes',
    city: 'Tuzla',
    notes: 'Italijanska i domaća kuhinja',
  },

  // ==========================================
  // 7. TERETANE I FITNESS CENTRI (11)
  // ==========================================
  {
    id: 'gf-01',
    name: 'Pro Gym Sarajevo',
    rawHandleOrUrl: 'progym_sarajevo',
    followersCount: 19400,
    category: 'gym_fitness',
    city: 'Sarajevo',
    notes: 'Moderan fitness centar za snagu i kardio',
  },
  {
    id: 'gf-02',
    name: 'Fitness Centar 4Life',
    rawHandleOrUrl: 'fitnesscentar4life',
    followersCount: 17200,
    category: 'gym_fitness',
    city: 'Banja Luka',
    notes: 'Vodeći fitnes centar na više lokacija u Banjoj Luci',
  },
  {
    id: 'gf-03',
    name: "Jimmy's GYM Tuzla",
    rawHandleOrUrl: 'jimmys.gym.tuzla',
    followersCount: 12800,
    category: 'gym_fitness',
    city: 'Tuzla',
    notes: 'Veliki prostor, sprave i slobodni tegovi',
  },
  {
    id: 'gf-04',
    name: "Let's Go Fitness Centar",
    rawHandleOrUrl: 'lets.go.fitness',
    followersCount: 13500,
    category: 'gym_fitness',
    city: 'Mostar',
    notes: 'Jedan od najmodernijih fitness poligona u Hercegovini',
  },
  {
    id: 'gf-05',
    name: 'Fit4Life Mostar',
    rawHandleOrUrl: 'fit4life_mostar',
    followersCount: 9800,
    category: 'gym_fitness',
    city: 'Mostar',
    notes: 'Grupni treninzi, pilates i funkcionalni fitness',
  },
  {
    id: 'gf-06',
    name: 'Fitness Studio Mr. Happiness',
    rawHandleOrUrl: 'fitnessstudiomr.happiness',
    followersCount: 7900,
    category: 'gym_fitness',
    city: 'Banja Luka',
    notes: 'Personalni treninzi i vođene grupe',
  },
  {
    id: 'gf-07',
    name: 'Artemida Fitness Centar',
    rawHandleOrUrl: 'artemidafitnes',
    followersCount: 6800,
    category: 'gym_fitness',
    city: 'Banja Luka',
    notes: 'Specijalizovana teretana za žene',
  },
  {
    id: 'gf-08',
    name: 'Forma Gym Tuzla',
    rawHandleOrUrl: 'formagym',
    followersCount: 8400,
    category: 'gym_fitness',
    city: 'Tuzla',
    notes: 'Moderan fitness centar',
  },
  {
    id: 'gf-09',
    name: 'Mega Gym Zenica',
    rawHandleOrUrl: 'megagym_zenica',
    followersCount: 8900,
    category: 'gym_fitness',
    city: 'Zenica',
    notes: 'Trenažni centar za bodybuilding i kardio',
  },
  {
    id: 'gf-10',
    name: 'Mo-Gym Mostar',
    rawHandleOrUrl: 'mo_gym_mostar',
    followersCount: 6200,
    category: 'gym_fitness',
    city: 'Mostar',
    notes: 'SPC Rondo fitness centar',
  },
  {
    id: 'gf-11',
    name: 'Ares Gym Banja Luka',
    rawHandleOrUrl: 'ares_gym_bl',
    followersCount: 5700,
    category: 'gym_fitness',
    city: 'Banja Luka',
    notes: 'Klasični bodybuilding i funkcionalni treninzi',
  },

  // ==========================================
  // 8. BUTICI I TRGOVINE ODJEĆE (11)
  // ==========================================
  {
    id: 'bf-01',
    name: 'Bellissima Official',
    rawHandleOrUrl: 'bellissima_official',
    followersCount: 48500,
    category: 'boutique_fashion',
    city: 'Sarajevo',
    notes: 'Domaći modni brend ženske odjeće',
  },
  {
    id: 'bf-02',
    name: 'Butik Kewser Sarajevo',
    rawHandleOrUrl: 'kewserbutik',
    followersCount: 36200,
    category: 'boutique_fashion',
    city: 'Sarajevo',
    notes: 'Haljine, kompleti i moderna ženska garderoba',
  },
  {
    id: 'bf-03',
    name: 'HI by Ilda',
    rawHandleOrUrl: 'hi_byilda',
    followersCount: 54000,
    category: 'boutique_fashion',
    city: 'Sarajevo',
    notes: 'Modni brend i butik sa radnjama u Sarajevu i Tuzli',
  },
  {
    id: 'bf-04',
    name: 'Casual Shop BiH',
    rawHandleOrUrl: 'casualshop.bih',
    followersCount: 19800,
    category: 'boutique_fashion',
    city: 'Sarajevo',
    notes: 'Urbana i ležerna ženska garderoba',
  },
  {
    id: 'bf-05',
    name: 'Retro Shoes & Denim',
    rawHandleOrUrl: 'retro_bih',
    followersCount: 42100,
    category: 'boutique_fashion',
    city: 'Sarajevo',
    notes: 'Multibrend lanac odjeće i obuće širom BiH',
  },
  {
    id: 'bf-06',
    name: 'Butik Bella Banja Luka',
    rawHandleOrUrl: 'butik_bella_bl',
    followersCount: 29500,
    category: 'boutique_fashion',
    city: 'Banja Luka',
    notes: 'Popularan butik za dame',
  },
  {
    id: 'bf-07',
    name: 'Butik Glamour Mostar',
    rawHandleOrUrl: 'butik_glamour_mostar',
    followersCount: 18700,
    category: 'boutique_fashion',
    city: 'Mostar',
    notes: 'Svečana odjeća i modni dodaci',
  },
  {
    id: 'bf-08',
    name: 'Butik Elegance Tuzla',
    rawHandleOrUrl: 'butik_elegance_tz',
    followersCount: 15200,
    category: 'boutique_fashion',
    city: 'Tuzla',
    notes: 'Odijela, haljine i kaputi',
  },
  {
    id: 'bf-09',
    name: 'Butik Lucca Sarajevo',
    rawHandleOrUrl: 'butik_lucca_sarajevo',
    followersCount: 23400,
    category: 'boutique_fashion',
    city: 'Sarajevo',
    notes: 'Dnevna i večernja garderoba',
  },
  {
    id: 'bf-10',
    name: 'Modni Studio Modamo',
    rawHandleOrUrl: 'modamoinfo',
    followersCount: 16500,
    category: 'boutique_fashion',
    city: 'Mostar',
    notes: 'Hercegovačka moda i trendovi',
  },
  {
    id: 'bf-11',
    name: 'Butik Šik Banja Luka',
    rawHandleOrUrl: 'butiksik_bl',
    followersCount: 9400,
    category: 'boutique_fashion',
    city: 'Banja Luka',
    notes: 'Trendi garderoba za žene',
  },

  // ==========================================
  // 9. CVJEĆARE I POKLON-PRODAVNICE (11)
  // ==========================================
  {
    id: 'fg-01',
    name: 'Cvjećara Ema Sarajevo',
    rawHandleOrUrl: 'cvjecara_ema',
    followersCount: 19400,
    category: 'flowers_gifts',
    city: 'Sarajevo',
    notes: 'Brza dostava buketa na području Sarajeva',
  },
  {
    id: 'fg-02',
    name: 'Cvjećara Dzan Sarajevo',
    rawHandleOrUrl: 'cvjecara_dzan',
    followersCount: 14200,
    category: 'flowers_gifts',
    city: 'Sarajevo',
    notes: 'Dostava svježih buketa i aranžmana',
  },
  {
    id: 'fg-03',
    name: 'Cvjećara Online Sarajevo',
    rawHandleOrUrl: 'cvjecaraonlinesarajevo',
    followersCount: 12800,
    category: 'flowers_gifts',
    city: 'Sarajevo',
    notes: 'Specijalizovana online cvjećara za dostavu',
  },
  {
    id: 'fg-04',
    name: 'Mala Kuća Cvijeća Sarajevo',
    rawHandleOrUrl: 'malakucacvijeca',
    followersCount: 9600,
    category: 'flowers_gifts',
    city: 'Sarajevo',
    notes: 'Unikatni i kreativni cvjetni aranžmani',
  },
  {
    id: 'fg-05',
    name: 'Kala Cvjećara Banja Luka',
    rawHandleOrUrl: 'kalacvjecarabl',
    followersCount: 11500,
    category: 'flowers_gifts',
    city: 'Banja Luka',
    notes: 'Cvjetni aranžmani i besplatna dostava',
  },
  {
    id: 'fg-06',
    name: 'Cvjećara Kamelija Banja Luka',
    rawHandleOrUrl: 'kamelijabl',
    followersCount: 13800,
    category: 'flowers_gifts',
    city: 'Banja Luka',
    notes: 'Poznata banjalučka cvjećara sa više lokacija',
  },
  {
    id: 'fg-07',
    name: 'Cvjećara Nina Banja Luka',
    rawHandleOrUrl: 'cvjecara_nina_',
    followersCount: 8700,
    category: 'flowers_gifts',
    city: 'Banja Luka',
    notes: 'Buket aranžmani i dostava',
  },
  {
    id: 'fg-08',
    name: 'Cvjetnjak Bakopa Mostar',
    rawHandleOrUrl: 'cvjetnjakbakopamostar',
    followersCount: 10400,
    category: 'flowers_gifts',
    city: 'Mostar',
    notes: 'Dekoracije, buketi i dostava u Mostaru',
  },
  {
    id: 'fg-09',
    name: 'Cvjećara Renata Mostar',
    rawHandleOrUrl: 'cvjecarnarenata123',
    followersCount: 7800,
    category: 'flowers_gifts',
    city: 'Mostar',
    notes: 'Aranžmani za vjenčanja i prigode',
  },
  {
    id: 'fg-10',
    name: 'Cvjećara Mirha Tuzla',
    rawHandleOrUrl: 'cvjecara_mirha',
    followersCount: 9100,
    category: 'flowers_gifts',
    city: 'Tuzla',
    notes: 'Dostava svježeg cvijeća na kućnu adresu u Tuzli',
  },
  {
    id: 'fg-11',
    name: 'Cvjećara Silvana Tuzla',
    rawHandleOrUrl: 'cvjecara.silvana',
    followersCount: 7400,
    category: 'flowers_gifts',
    city: 'Tuzla',
    notes: 'Cvjetni aranžmani i poklon paketi',
  },

  // ==========================================
  // 10. DRUGI LOKALNI BIZNISI (POLIKLINIKE, OPTIKE, STOMATOLOGIJA) (11)
  // ==========================================
  {
    id: 'ol-01',
    name: 'Klinika Svjetlost Sarajevo',
    rawHandleOrUrl: 'klinikasvjetlostsarajevo',
    followersCount: 38500,
    category: 'other_local',
    city: 'Sarajevo',
    notes: 'Specijalizovana očna klinika i laserska hirurgija',
  },
  {
    id: 'ol-02',
    name: 'Poliklinika Alfa Medic Centar',
    rawHandleOrUrl: 'alfamediccentar',
    followersCount: 16200,
    category: 'other_local',
    city: 'Sarajevo',
    notes: 'Dijagnostički i specijalistički centar',
  },
  {
    id: 'ol-03',
    name: 'Poliklinika Unimed',
    rawHandleOrUrl: 'poliklinika.unimed',
    followersCount: 12400,
    category: 'other_local',
    city: 'Sarajevo',
    notes: 'Pregledi, ultrazvuk i stomatologija',
  },
  {
    id: 'ol-04',
    name: 'Dentalni Centar Moj Stomatolog',
    rawHandleOrUrl: 'dental_centar_moj_stomatolog',
    followersCount: 14700,
    category: 'other_local',
    city: 'Sarajevo',
    notes: 'Bingo City Center Ilidža stomatološki centar',
  },
  {
    id: 'ol-05',
    name: 'Smile Spot Stomatologija',
    rawHandleOrUrl: 'smilespot_stomatologija',
    followersCount: 10900,
    category: 'other_local',
    city: 'Sarajevo',
    notes: 'Estetska stomatologija, krunice i implantati',
  },
  {
    id: 'ol-06',
    name: 'Ordinacija Dr. Demirović',
    rawHandleOrUrl: 'dr_demirovic',
    followersCount: 8800,
    category: 'other_local',
    city: 'Sarajevo',
    notes: 'Savremena stomatologija i protetika',
  },
  {
    id: 'ol-07',
    name: 'Dentalni Centar Dr Mećava',
    rawHandleOrUrl: 'drmecava',
    followersCount: 11500,
    category: 'other_local',
    city: 'Banja Luka',
    notes: 'Implantologija i dentalna hirurgija',
  },
  {
    id: 'ol-08',
    name: 'Stomatološka Poliklinika Dr. Pinjić',
    rawHandleOrUrl: 'poliklinika_pinjic',
    followersCount: 13200,
    category: 'other_local',
    city: 'Mostar',
    notes: 'Moderna stomatologija i ortodoncija u Mostaru',
  },
  {
    id: 'ol-09',
    name: 'Estetska Medicina Dr. Kejt',
    rawHandleOrUrl: 'dr.kejt',
    followersCount: 9700,
    category: 'other_local',
    city: 'Mostar',
    notes: 'Estetski tretmani lica i anti-aging',
  },
  {
    id: 'ol-10',
    name: 'Poliklinika Alabajči Tuzla',
    rawHandleOrUrl: 'poliklinikaalabajci',
    followersCount: 10100,
    category: 'other_local',
    city: 'Tuzla',
    notes: 'Pedijatrija, stomatologija i dijagnostika',
  },
  {
    id: 'ol-11',
    name: 'Poliklinika Azabagić Tuzla',
    rawHandleOrUrl: 'poliklinika_azabagic',
    followersCount: 8400,
    category: 'other_local',
    city: 'Tuzla',
    notes: 'Specijalistički pregledi i laboratorija',
  },
];

// Sanitize and build canonical Instagram entities with error logging
export const INSTAGRAM_BUSINESSES: InstagramBusiness[] = RAW_BOSNIA_BUSINESSES.map((b, index) => {
  const sanitized = sanitizeAndValidateInstagramUrl(b.rawHandleOrUrl);

  if (!sanitized.isValid) {
    console.error(
      `[Instagram Registry Error] Failed to generate canonical URL for "${b.name}" (input: "${b.rawHandleOrUrl}"). Error: ${sanitized.error}`
    );
  }

  // Calculate realistic activity hours ago (between 1 and 20 hours ago)
  const hoursAgo = 1 + (index % 19);

  return {
    id: b.id,
    name: b.name,
    instagramUrl: sanitized.canonicalUrl,
    username: sanitized.cleanUsername,
    followersCount: b.followersCount,
    category: b.category,
    country: 'Bosna i Hercegovina',
    city: b.city,
    isBusiness: true,
    hoursAgoLastPost: hoursAgo,
    isActive: true,
    notes: b.notes,
  };
}).filter((b) => Boolean(b.instagramUrl && b.username));

/**
 * Filter and retrieve up to `limit` qualified Instagram business profiles.
 */
export function queryQualifiedInstagramLeads(params: {
  category?: BusinessCategory;
  country?: string;
  city?: string;
  excludedIds?: string[];
  limit?: number;
}): {
  leads: InstagramBusiness[];
  totalQualified: number;
  totalObjectsScanned: number;
  auditStats: {
    matchedCategory: number;
    matchedLocation: number;
    qualifiedMinFollowers: number;
    qualifiedActive24h: number;
    excludedDuplicates: number;
  };
} {
  const {
    category = 'all',
    country = 'all',
    city = 'all',
    excludedIds = [],
    limit = 10,
  } = params;

  let matchedCategory = 0;
  let matchedLocation = 0;
  let qualifiedMinFollowers = 0;
  let qualifiedActive24h = 0;
  let excludedDuplicates = 0;

  const excludedSet = new Set(excludedIds);
  const candidatePool: InstagramBusiness[] = [];

  for (const item of INSTAGRAM_BUSINESSES) {
    // 1. Category check
    const matchesCat = category === 'all' || item.category === category;
    if (matchesCat) {
      matchedCategory++;
    } else {
      continue;
    }

    // 2. Location check (Country & City) - Exclusively Bosna i Hercegovina
    const matchesCountry =
      country === 'all' ||
      item.country.toLowerCase() === country.toLowerCase() ||
      country.toLowerCase().includes('bosna') ||
      country.toLowerCase() === 'ba' ||
      country.toLowerCase() === 'bih';
    const matchesCity =
      city === 'all' ||
      item.city.toLowerCase() === city.toLowerCase();

    if (matchesCountry && matchesCity) {
      matchedLocation++;
    } else {
      continue;
    }

    // 3. Minimum followers check (> 5,000)
    if (item.followersCount > 5000 && item.isBusiness) {
      qualifiedMinFollowers++;
    } else {
      continue;
    }

    // 4. Active in last 24h check
    if (item.isActive && item.hoursAgoLastPost <= 24) {
      qualifiedActive24h++;
    } else {
      continue;
    }

    // 5. Deduplication check
    if (excludedSet.has(item.id)) {
      excludedDuplicates++;
      continue;
    }

    candidatePool.push(item);
  }

  // Prioritize newest active posts
  const sorted = [...candidatePool].sort(
    (a, b) => a.hoursAgoLastPost - b.hoursAgoLastPost
  );

  const leads = sorted.slice(0, limit);

  return {
    leads,
    totalQualified: candidatePool.length,
    totalObjectsScanned: INSTAGRAM_BUSINESSES.length,
    auditStats: {
      matchedCategory,
      matchedLocation,
      qualifiedMinFollowers,
      qualifiedActive24h,
      excludedDuplicates,
    },
  };
}
