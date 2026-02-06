import React from 'react';
import { CityData, GalleryItem, ServiceItem, VideoMedia, Lead, ContactMessage } from './types';
import { Sun, Zap, BatteryCharging, ThermometerSun } from 'lucide-react';

// Comprehensive Turkey City Data


export type CityData = { name: string; districts: string[] };

export const TURKEY_CITIES: CityData[] = [
  {
    "name": "Adana",
    "districts": [
      "Aladağ",
      "Ceyhan",
      "Çukurova",
      "Feke",
      "İmamoğlu",
      "Karaisalı",
      "Karataş",
      "Kozan",
      "Pozantı",
      "Saimbeyli",
      "Sarıçam",
      "Seyhan",
      "Tufanbeyli",
      "Yumurtalık",
      "Yüreğir"
    ]
  },
  {
    "name": "Adıyaman",
    "districts": [
      "Besni",
      "Çelikhan",
      "Gerger",
      "Gölbaşı",
      "Kahta",
      "Merkez",
      "Samsat",
      "Sincik",
      "Tut"
    ]
  },
  {
    "name": "Afyonkarahisar",
    "districts": [
      "Başmakçı",
      "Bayat",
      "Bolvadin",
      "Çay",
      "Çobanlar",
      "Dazkırı",
      "Dinar",
      "Emirdağ",
      "Evciler",
      "Hocalar",
      "İhsaniye",
      "İscehisar",
      "Kızılören",
      "Merkez",
      "Sandıklı",
      "Sinanpaşa",
      "Sultandağı",
      "Şuhut"
    ]
  },
  {
    "name": "Ağrı",
    "districts": [
      "Diyadin",
      "Doğubayazıt",
      "Eleşkirt",
      "Hamur",
      "Merkez",
      "Patnos",
      "Taşlıçay",
      "Tutak"
    ]
  },
  {
    "name": "Aksaray",
    "districts": [
      "Ağaçören",
      "Eskil",
      "Gülağaç",
      "Güzelyurt",
      "Merkez",
      "Ortaköy",
      "Sarıyahşi",
      "Sultanhanı"
    ]
  },
  {
    "name": "Amasya",
    "districts": [
      "Göynücek",
      "Gümüşhacıköy",
      "Hamamözü",
      "Merkez",
      "Merzifon",
      "Suluova",
      "Taşova"
    ]
  },
  {
    "name": "Ankara",
    "districts": [
      "Akyurt",
      "Altındağ",
      "Ayaş",
      "Bala",
      "Beypazarı",
      "Çamlıdere",
      "Çankaya",
      "Çubuk",
      "Elmadağ",
      "Etimesgut",
      "Evren",
      "Gölbaşı",
      "Güdül",
      "Haymana",
      "Kahramankazan",
      "Kalecik",
      "Keçiören",
      "Kızılcahamam",
      "Mamak",
      "Nallıhan",
      "Polatlı",
      "Pursaklar",
      "Sincan",
      "Şereflikoçhisar",
      "Yenimahalle"
    ]
  },
  {
    "name": "Antalya",
    "districts": [
      "Akseki",
      "Aksu",
      "Alanya",
      "Demre",
      "Döşemealtı",
      "Elmalı",
      "Finike",
      "Gazipaşa",
      "Gündoğmuş",
      "İbradı",
      "Kaş",
      "Kemer",
      "Kepez",
      "Konyaaltı",
      "Korkuteli",
      "Kumluca",
      "Manavgat",
      "Muratpaşa",
      "Serik"
    ]
  },
  {
    "name": "Ardahan",
    "districts": [
      "Çıldır",
      "Damal",
      "Göle",
      "Hanak",
      "Merkez",
      "Posof"
    ]
  },
  {
    "name": "Artvin",
    "districts": [
      "Ardanuç",
      "Arhavi",
      "Borçka",
      "Hopa",
      "Kemalpaşa",
      "Merkez",
      "Murgul",
      "Şavşat",
      "Yusufeli"
    ]
  },
  {
    "name": "Aydın",
    "districts": [
      "Bozdoğan",
      "Buharkent",
      "Çine",
      "Didim",
      "Efeler",
      "Germencik",
      "İncirliova",
      "Karacasu",
      "Karpuzlu",
      "Koçarlı",
      "Köşk",
      "Kuşadası",
      "Kuyucak",
      "Nazilli",
      "Söke",
      "Sultanhisar",
      "Yenipazar"
    ]
  },
  {
    "name": "Balıkesir",
    "districts": [
      "Altıeylül",
      "Ayvalık",
      "Balya",
      "Bandırma",
      "Bigadiç",
      "Burhaniye",
      "Dursunbey",
      "Edremit",
      "Erdek",
      "Gömeç",
      "Gönen",
      "Havran",
      "İvrindi",
      "Karesi",
      "Kepsut",
      "Manyas",
      "Marmara",
      "Savaştepe",
      "Sındırgı",
      "Susurluk"
    ]
  },
  {
    "name": "Bartın",
    "districts": [
      "Amasra",
      "Kurucaşile",
      "Merkez",
      "Ulus"
    ]
  },
  {
    "name": "Batman",
    "districts": [
      "Beşiri",
      "Gercüş",
      "Hasankeyf",
      "Kozluk",
      "Merkez",
      "Sason"
    ]
  },
  {
    "name": "Bayburt",
    "districts": [
      "Aydıntepe",
      "Demirözü",
      "Merkez"
    ]
  },
  {
    "name": "Bilecik",
    "districts": [
      "Bozüyük",
      "Gölpazarı",
      "İnhisar",
      "Merkez",
      "Osmaneli",
      "Pazaryeri",
      "Söğüt",
      "Yenipazar"
    ]
  },
  {
    "name": "Bingöl",
    "districts": [
      "Adaklı",
      "Genç",
      "Karlıova",
      "Kiğı",
      "Merkez",
      "Solhan",
      "Yayladere",
      "Yedisu"
    ]
  },
  {
    "name": "Bitlis",
    "districts": [
      "Adilcevaz",
      "Ahlat",
      "Güroymak",
      "Hizan",
      "Merkez",
      "Mutki",
      "Tatvan"
    ]
  },
  {
    "name": "Bolu",
    "districts": [
      "Dörtdivan",
      "Gerede",
      "Göynük",
      "Kıbrıscık",
      "Mengen",
      "Merkez",
      "Mudurnu",
      "Seben",
      "Yeniçağa"
    ]
  },
  {
    "name": "Burdur",
    "districts": [
      "Ağlasun",
      "Altınyayla",
      "Bucak",
      "Çavdır",
      "Çeltikçi",
      "Gölhisar",
      "Karamanlı",
      "Kemer",
      "Merkez",
      "Tefenni",
      "Yeşilova"
    ]
  },
  {
    "name": "Bursa",
    "districts": [
      "Büyükorhan",
      "Gemlik",
      "Gürsu",
      "Harmancık",
      "İnegöl",
      "İznik",
      "Karacabey",
      "Keles",
      "Kestel",
      "Mudanya",
      "Mustafakemalpaşa",
      "Nilüfer",
      "Orhaneli",
      "Orhangazi",
      "Osmangazi",
      "Yenişehir",
      "Yıldırım"
    ]
  },
  {
    "name": "Çanakkale",
    "districts": [
      "Ayvacık",
      "Bayramiç",
      "Biga",
      "Bozcaada",
      "Çan",
      "Eceabat",
      "Ezine",
      "Gelibolu",
      "Gökçeada",
      "Lapseki",
      "Merkez",
      "Yenice"
    ]
  },
  {
    "name": "Çankırı",
    "districts": [
      "Atkaracalar",
      "Bayramören",
      "Çerkeş",
      "Eldivan",
      "Ilgaz",
      "Kızılırmak",
      "Korgun",
      "Kurşunlu",
      "Merkez",
      "Orta",
      "Şabanözü",
      "Yapraklı"
    ]
  },
  {
    "name": "Çorum",
    "districts": [
      "Alaca",
      "Bayat",
      "Boğazkale",
      "Dodurga",
      "İskilip",
      "Kargı",
      "Laçin",
      "Mecitözü",
      "Merkez",
      "Oğuzlar",
      "Ortaköy",
      "Osmancık",
      "Sungurlu",
      "Uğurludağ"
    ]
  },
  {
    "name": "Denizli",
    "districts": [
      "Acıpayam",
      "Babadağ",
      "Baklan",
      "Bekilli",
      "Beyağaç",
      "Bozkurt",
      "Buldan",
      "Çal",
      "Çameli",
      "Çardak",
      "Çivril",
      "Güney",
      "Honaz",
      "Kale",
      "Merkezefendi",
      "Pamukkale",
      "Sarayköy",
      "Serinhisar",
      "Tavas"
    ]
  },
  {
    "name": "Diyarbakır",
    "districts": [
      "Bağlar",
      "Bismil",
      "Çermik",
      "Çınar",
      "Çüngüş",
      "Dicle",
      "Eğil",
      "Ergani",
      "Hani",
      "Hazro",
      "Kayapınar",
      "Kocaköy",
      "Kulp",
      "Lice",
      "Silvan",
      "Sur",
      "Yenişehir"
    ]
  },
  {
    "name": "Düzce",
    "districts": [
      "Akçakoca",
      "Cumayeri",
      "Çilimli",
      "Gölyaka",
      "Gümüşova",
      "Kaynaşlı",
      "Merkez",
      "Yığılca"
    ]
  },
  {
    "name": "Edirne",
    "districts": [
      "Enez",
      "Havsa",
      "İpsala",
      "Keşan",
      "Lalapaşa",
      "Meriç",
      "Merkez",
      "Süloğlu",
      "Uzunköprü"
    ]
  },
  {
    "name": "Elazığ",
    "districts": [
      "Ağın",
      "Alacakaya",
      "Arıcak",
      "Baskil",
      "Karakoçan",
      "Keban",
      "Kovancılar",
      "Maden",
      "Merkez",
      "Palu",
      "Sivrice"
    ]
  },
  {
    "name": "Erzincan",
    "districts": [
      "Çayırlı",
      "İliç",
      "Kemah",
      "Kemaliye",
      "Merkez",
      "Otlukbeli",
      "Refahiye",
      "Tercan",
      "Üzümlü"
    ]
  },
  {
    "name": "Erzurum",
    "districts": [
      "Aşkale",
      "Aziziye",
      "Çat",
      "Hınıs",
      "Horasan",
      "İspir",
      "Karaçoban",
      "Karayazı",
      "Köprüköy",
      "Narman",
      "Oltu",
      "Olur",
      "Palandöken",
      "Pasinler",
      "Pazaryolu",
      "Şenkaya",
      "Tekman",
      "Tortum",
      "Uzundere",
      "Yakutiye"
    ]
  },
  {
    "name": "Eskişehir",
    "districts": [
      "Alpu",
      "Beylikova",
      "Çifteler",
      "Günyüzü",
      "Han",
      "İnönü",
      "Mahmudiye",
      "Mihalgazi",
      "Mihalıççık",
      "Odunpazarı",
      "Sarıcakaya",
      "Seyitgazi",
      "Sivrihisar",
      "Tepebaşı"
    ]
  },
  {
    "name": "Gaziantep",
    "districts": [
      "Araban",
      "İslahiye",
      "Karkamış",
      "Nizip",
      "Nurdağı",
      "Oğuzeli",
      "Şahinbey",
      "Şehitkamil",
      "Yavuzeli"
    ]
  },
  {
    "name": "Giresun",
    "districts": [
      "Alucra",
      "Bulancak",
      "Çamoluk",
      "Çanakçı",
      "Dereli",
      "Doğankent",
      "Espiye",
      "Eynesil",
      "Görele",
      "Güce",
      "Keşap",
      "Merkez",
      "Piraziz",
      "Şebinkarahisar",
      "Tirebolu",
      "Yağlıdere"
    ]
  },
  {
    "name": "Gümüşhane",
    "districts": [
      "Kelkit",
      "Köse",
      "Kürtün",
      "Merkez",
      "Şiran",
      "Torul"
    ]
  },
  {
    "name": "Hakkari",
    "districts": [
      "Çukurca",
      "Derecik",
      "Merkez",
      "Şemdinli",
      "Yüksekova"
    ]
  },
  {
    "name": "Hatay",
    "districts": [
      "Altınözü",
      "Antakya",
      "Arsuz",
      "Belen",
      "Defne",
      "Dörtyol",
      "Erzin",
      "Hassa",
      "İskenderun",
      "Kırıkhan",
      "Kumlu",
      "Payas",
      "Reyhanlı",
      "Samandağ",
      "Yayladağı"
    ]
  },
  {
    "name": "Iğdır",
    "districts": [
      "Aralık",
      "Karakoyunlu",
      "Merkez",
      "Tuzluca"
    ]
  },
  {
    "name": "Isparta",
    "districts": [
      "Aksu",
      "Atabey",
      "Eğirdir",
      "Gelendost",
      "Gönen",
      "Keçiborlu",
      "Merkez",
      "Senirkent",
      "Sütçüler",
      "Şarkikaraağaç",
      "Uluborlu",
      "Yalvaç",
      "Yenişarbademli"
    ]
  },
  {
    "name": "İstanbul",
    "districts": [
      "Adalar",
      "Arnavutköy",
      "Ataşehir",
      "Avcılar",
      "Bağcılar",
      "Bahçelievler",
      "Bakırköy",
      "Başakşehir",
      "Bayrampaşa",
      "Beşiktaş",
      "Beykoz",
      "Beylikdüzü",
      "Beyoğlu",
      "Büyükçekmece",
      "Çatalca",
      "Çekmeköy",
      "Esenler",
      "Esenyurt",
      "Eyüpsultan",
      "Fatih",
      "Gaziosmanpaşa",
      "Güngören",
      "Kadıköy",
      "Kağıthane",
      "Kartal",
      "Küçükçekmece",
      "Maltepe",
      "Pendik",
      "Sancaktepe",
      "Sarıyer",
      "Silivri",
      "Sultanbeyli",
      "Sultangazi",
      "Şile",
      "Şişli",
      "Tuzla",
      "Ümraniye",
      "Üsküdar",
      "Zeytinburnu"
    ]
  },
  {
    "name": "İzmir",
    "districts": [
      "Aliağa",
      "Balçova",
      "Bayındır",
      "Bayraklı",
      "Bergama",
      "Beydağ",
      "Bornova",
      "Buca",
      "Çeşme",
      "Çiğli",
      "Dikili",
      "Foça",
      "Gaziemir",
      "Güzelbahçe",
      "Karabağlar",
      "Karaburun",
      "Karşıyaka",
      "Kemalpaşa",
      "Kınık",
      "Kiraz",
      "Konak",
      "Menderes",
      "Menemen",
      "Narlıdere",
      "Ödemiş",
      "Seferihisar",
      "Selçuk",
      "Tire",
      "Torbalı",
      "Urla"
    ]
  },
  {
    "name": "Kahramanmaraş",
    "districts": [
      "Afşin",
      "Andırın",
      "Çağlayancerit",
      "Dulkadiroğlu",
      "Ekinözü",
      "Elbistan",
      "Göksun",
      "Nurhak",
      "Onikişubat",
      "Pazarcık",
      "Türkoğlu"
    ]
  },
  {
    "name": "Karabük",
    "districts": [
      "Eflani",
      "Eskipazar",
      "Merkez",
      "Ovacık",
      "Safranbolu",
      "Yenice"
    ]
  },
  {
    "name": "Karaman",
    "districts": [
      "Ayrancı",
      "Başyayla",
      "Ermenek",
      "Kazımkarabekir",
      "Merkez",
      "Sarıveliler"
    ]
  },
  {
    "name": "Kars",
    "districts": [
      "Akyaka",
      "Arpaçay",
      "Digor",
      "Kağızman",
      "Merkez",
      "Sarıkamış",
      "Selim",
      "Susuz"
    ]
  },
  {
    "name": "Kastamonu",
    "districts": [
      "Abana",
      "Ağlı",
      "Araç",
      "Azdavay",
      "Bozkurt",
      "Cide",
      "Çatalzeytin",
      "Daday",
      "Devrekani",
      "Doğanyurt",
      "Hanönü",
      "İhsangazi",
      "İnebolu",
      "Küre",
      "Merkez",
      "Pınarbaşı",
      "Seydiler",
      "Şenpazar",
      "Taşköprü",
      "Tosya"
    ]
  },
  {
    "name": "Kayseri",
    "districts": [
      "Akkışla",
      "Bünyan",
      "Develi",
      "Felahiye",
      "Hacılar",
      "İncesu",
      "Kocasinan",
      "Melikgazi",
      "Özvatan",
      "Pınarbaşı",
      "Sarıoğlan",
      "Sarız",
      "Talas",
      "Tomarza",
      "Yahyalı",
      "Yeşilhisar"
    ]
  },
  {
    "name": "Kırıkkale",
    "districts": [
      "Bahşılı",
      "Balışeyh",
      "Çelebi",
      "Delice",
      "Karakeçili",
      "Keskin",
      "Merkez",
      "Sulakyurt",
      "Yahşihan"
    ]
  },
  {
    "name": "Kırklareli",
    "districts": [
      "Babaeski",
      "Demirköy",
      "Kofçaz",
      "Lüleburgaz",
      "Merkez",
      "Pehlivanköy",
      "Pınarhisar",
      "Vize"
    ]
  },
  {
    "name": "Kırşehir",
    "districts": [
      "Akçakent",
      "Akpınar",
      "Boztepe",
      "Çiçekdağı",
      "Kaman",
      "Merkez",
      "Mucur"
    ]
  },
  {
    "name": "Kilis",
    "districts": [
      "Elbeyli",
      "Merkez",
      "Musabeyli",
      "Polateli"
    ]
  },
  {
    "name": "Kocaeli",
    "districts": [
      "Başiskele",
      "Çayırova",
      "Darıca",
      "Derince",
      "Dilovası",
      "Gebze",
      "Gölcük",
      "İzmit",
      "Kandıra",
      "Karamürsel",
      "Kartepe",
      "Körfez"
    ]
  },
  {
    "name": "Konya",
    "districts": [
      "Ahırlı",
      "Akören",
      "Akşehir",
      "Altınekin",
      "Beyşehir",
      "Bozkır",
      "Cihanbeyli",
      "Çeltik",
      "Çumra",
      "Derbent",
      "Derebucak",
      "Doğanhisar",
      "Emirgazi",
      "Ereğli",
      "Güneysınır",
      "Hadim",
      "Halkapınar",
      "Hüyük",
      "Ilgın",
      "Kadınhanı",
      "Karapınar",
      "Karatay",
      "Kulu",
      "Meram",
      "Sarayönü",
      "Selçuklu",
      "Seydişehir",
      "Taşkent",
      "Tuzlukçu",
      "Yalıhüyük",
      "Yunak"
    ]
  },
  {
    "name": "Kütahya",
    "districts": [
      "Altıntaş",
      "Aslanapa",
      "Çavdarhisar",
      "Domaniç",
      "Dumlupınar",
      "Emet",
      "Gediz",
      "Hisarcık",
      "Merkez",
      "Pazarlar",
      "Simav",
      "Şaphane",
      "Tavşanlı"
    ]
  },
  {
    "name": "Malatya",
    "districts": [
      "Akçadağ",
      "Arapgir",
      "Arguvan",
      "Battalgazi",
      "Darende",
      "Doğanşehir",
      "Doğanyol",
      "Hekimhan",
      "Kale",
      "Kuluncak",
      "Pütürge",
      "Yazıhan",
      "Yeşilyurt"
    ]
  },
  {
    "name": "Manisa",
    "districts": [
      "Ahmetli",
      "Akhisar",
      "Alaşehir",
      "Demirci",
      "Gölmarmara",
      "Gördes",
      "Kırkağaç",
      "Köprübaşı",
      "Kula",
      "Salihli",
      "Sarıgöl",
      "Saruhanlı",
      "Selendi",
      "Soma",
      "Şehzadeler",
      "Turgutlu",
      "Yunusemre"
    ]
  },
  {
    "name": "Mardin",
    "districts": [
      "Artuklu",
      "Dargeçit",
      "Derik",
      "Kızıltepe",
      "Mazıdağı",
      "Midyat",
      "Nusaybin",
      "Ömerli",
      "Savur",
      "Yeşilli"
    ]
  },
  {
    "name": "Mersin",
    "districts": [
      "Akdeniz",
      "Anamur",
      "Aydıncık",
      "Bozyazı",
      "Çamlıyayla",
      "Erdemli",
      "Gülnar",
      "Mezitli",
      "Mut",
      "Silifke",
      "Tarsus",
      "Toroslar",
      "Yenişehir"
    ]
  },
  {
    "name": "Muğla",
    "districts": [
      "Bodrum",
      "Dalaman",
      "Datça",
      "Fethiye",
      "Kavaklıdere",
      "Köyceğiz",
      "Marmaris",
      "Menteşe",
      "Milas",
      "Ortaca",
      "Seydikemer",
      "Ula",
      "Yatağan"
    ]
  },
  {
    "name": "Muş",
    "districts": [
      "Bulanık",
      "Hasköy",
      "Korkut",
      "Malazgirt",
      "Merkez",
      "Varto"
    ]
  },
  {
    "name": "Nevşehir",
    "districts": [
      "Acıgöl",
      "Avanos",
      "Derinkuyu",
      "Gülşehir",
      "Hacıbektaş",
      "Kozaklı",
      "Merkez",
      "Ürgüp"
    ]
  },
  {
    "name": "Niğde",
    "districts": [
      "Altunhisar",
      "Bor",
      "Çamardı",
      "Çiftlik",
      "Merkez",
      "Ulukışla"
    ]
  },
  {
    "name": "Ordu",
    "districts": [
      "Akkuş",
      "Altınordu",
      "Aybastı",
      "Çamaş",
      "Çatalpınar",
      "Çaybaşı",
      "Fatsa",
      "Gölköy",
      "Gülyalı",
      "Gürgentepe",
      "İkizce",
      "Kabadüz",
      "Kabataş",
      "Korgan",
      "Kumru",
      "Mesudiye",
      "Perşembe",
      "Ulubey",
      "Ünye"
    ]
  },
  {
    "name": "Osmaniye",
    "districts": [
      "Bahçe",
      "Düziçi",
      "Hasanbeyli",
      "Kadirli",
      "Merkez",
      "Sumbas",
      "Toprakkale"
    ]
  },
  {
    "name": "Rize",
    "districts": [
      "Ardeşen",
      "Çamlıhemşin",
      "Çayeli",
      "Derepazarı",
      "Fındıklı",
      "Güneysu",
      "Hemşin",
      "İkizdere",
      "İyidere",
      "Kalkandere",
      "Merkez",
      "Pazar"
    ]
  },
  {
    "name": "Sakarya",
    "districts": [
      "Adapazarı",
      "Akyazı",
      "Arifiye",
      "Erenler",
      "Ferizli",
      "Geyve",
      "Hendek",
      "Karapürçek",
      "Karasu",
      "Kaynarca",
      "Kocaali",
      "Pamukova",
      "Sapanca",
      "Serdivan",
      "Söğütlü",
      "Taraklı"
    ]
  },
  {
    "name": "Samsun",
    "districts": [
      "19 Mayıs",
      "Alaçam",
      "Asarcık",
      "Atakum",
      "Ayvacık",
      "Bafra",
      "Canik",
      "Çarşamba",
      "Havza",
      "İlkadım",
      "Kavak",
      "Ladik",
      "Salıpazarı",
      "Tekkeköy",
      "Terme",
      "Vezirköprü",
      "Yakakent"
    ]
  },
  {
    "name": "Siirt",
    "districts": [
      "Baykan",
      "Eruh",
      "Kurtalan",
      "Merkez",
      "Pervari",
      "Şirvan",
      "Tillo"
    ]
  },
  {
    "name": "Sinop",
    "districts": [
      "Ayancık",
      "Boyabat",
      "Dikmen",
      "Durağan",
      "Erfelek",
      "Gerze",
      "Merkez",
      "Saraydüzü",
      "Türkeli"
    ]
  },
  {
    "name": "Sivas",
    "districts": [
      "Akıncılar",
      "Altınyayla",
      "Divriği",
      "Doğanşar",
      "Gemerek",
      "Gölova",
      "Gürün",
      "Hafik",
      "İmranlı",
      "Kangal",
      "Koyulhisar",
      "Merkez",
      "Suşehri",
      "Şarkışla",
      "Ulaş",
      "Yıldızeli",
      "Zara"
    ]
  },
  {
    "name": "Şanlıurfa",
    "districts": [
      "Akçakale",
      "Birecik",
      "Bozova",
      "Ceylanpınar",
      "Eyyübiye",
      "Halfeti",
      "Haliliye",
      "Harran",
      "Hilvan",
      "Karaköprü",
      "Siverek",
      "Suruç",
      "Viranşehir"
    ]
  },
  {
    "name": "Şırnak",
    "districts": [
      "Beytüşşebap",
      "Cizre",
      "Güçlükonak",
      "İdil",
      "Merkez",
      "Silopi",
      "Uludere"
    ]
  },
  {
    "name": "Tekirdağ",
    "districts": [
      "Çerkezköy",
      "Çorlu",
      "Ergene",
      "Hayrabolu",
      "Kapaklı",
      "Malkara",
      "Marmaraereğlisi",
      "Muratlı",
      "Saray",
      "Süleymanpaşa",
      "Şarköy"
    ]
  },
  {
    "name": "Tokat",
    "districts": [
      "Almus",
      "Artova",
      "Başçiftlik",
      "Erbaa",
      "Merkez",
      "Niksar",
      "Pazar",
      "Reşadiye",
      "Sulusaray",
      "Turhal",
      "Yeşilyurt",
      "Zile"
    ]
  },
  {
    "name": "Trabzon",
    "districts": [
      "Akçaabat",
      "Araklı",
      "Arsin",
      "Beşikdüzü",
      "Çarşıbaşı",
      "Çaykara",
      "Dernekpazarı",
      "Düzköy",
      "Hayrat",
      "Köprübaşı",
      "Maçka",
      "Of",
      "Ortahisar",
      "Sürmene",
      "Şalpazarı",
      "Tonya",
      "Vakfıkebir",
      "Yomra"
    ]
  },
  {
    "name": "Tunceli",
    "districts": [
      "Çemişgezek",
      "Hozat",
      "Mazgirt",
      "Merkez",
      "Nazımiye",
      "Ovacık",
      "Pertek",
      "Pülümür"
    ]
  },
  {
    "name": "Uşak",
    "districts": [
      "Banaz",
      "Eşme",
      "Karahallı",
      "Merkez",
      "Sivaslı",
      "Ulubey"
    ]
  },
  {
    "name": "Van",
    "districts": [
      "Bahçesaray",
      "Başkale",
      "Çaldıran",
      "Çatak",
      "Edremit",
      "Erciş",
      "Gevaş",
      "Gürpınar",
      "İpekyolu",
      "Muradiye",
      "Özalp",
      "Saray",
      "Tuşba"
    ]
  },
  {
    "name": "Yalova",
    "districts": [
      "Altınova",
      "Armutlu",
      "Çınarcık",
      "Çiftlikköy",
      "Merkez",
      "Termal"
    ]
  },
  {
    "name": "Yozgat",
    "districts": [
      "Akdağmadeni",
      "Aydıncık",
      "Boğazlıyan",
      "Çandır",
      "Çayıralan",
      "Çekerek",
      "Kadışehri",
      "Merkez",
      "Saraykent",
      "Sarıkaya",
      "Sorgun",
      "Şefaatli",
      "Yenifakılı",
      "Yerköy"
    ]
  },
  {
    "name": "Zonguldak",
    "districts": [
      "Alaplı",
      "Çaycuma",
      "Devrek",
      "Ereğli",
      "Gökçebey",
      "Kilimli",
      "Kozlu",
      "Merkez"
    ]
  }
];


export const SERVICES: ServiceItem[] = [
  {
    id: 'solar',
    title: 'Solar Sistemler',
    description: 'Konut ve ticari çatılar için yüksek verimli fotovoltaik paneller.',
    icon: React.createElement(Sun, { strokeWidth: 1.25 }),
    features: ['25 Yıl Garanti', 'Yüksek Verim', 'Uzaktan İzleme']
  },
  {
    id: 'ev',
    title: 'Elektrikli Araç Şarj',
    description: 'Eviniz ve iş yeriniz için hızlı, güvenli AC/DC şarj istasyonları.',
    icon: React.createElement(Zap, { strokeWidth: 1.25 }),
    features: ['Akıllı Yönetim', 'Hızlı Şarj', 'Evrensel Uyumluluk']
  },
  {
    id: 'storage',
    title: 'Enerji Depolama',
    description: 'Güneşin olmadığı saatlerde bile kesintisiz enerji için batarya çözümleri.',
    icon: React.createElement(BatteryCharging, { strokeWidth: 1.25 }),
    features: ['Li-Ion Teknoloji', 'Kesintisiz Güç', 'Uzun Ömür']
  },
  {
    id: 'heatpump',
    title: 'Isı Pompası',
    description: 'Maksimum enerji tasarrufu için entegre iklimlendirme sistemleri.',
    icon: React.createElement(ThermometerSun, { strokeWidth: 1.25 }),
    features: ['Yüksek SCOP', 'Sessiz Çalışma', 'Akıllı Termostat']
  }
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: 'Yalıkavak Villa Projesi',
    category: 'Konut Solar',
    city: 'Muğla',
    description: '12kW kurulu güç, 15kWh depolama sistemi ile tam bağımsız villa.',
    imageUrl: '/images/4.jpeg',
    date: '2023-08-15',
    tags: ['Villa', 'Hibrit', 'Bodrum']
  },
  {
    id: '2',
    title: 'Teknopark Endüstriyel Çatı',
    category: 'Ticari Solar',
    city: 'İstanbul',
    description: '500kW endüstriyel kurulum, yıllık 3 milyon TL tasarruf.',
    imageUrl: '/images/1.jpeg',
    date: '2023-11-02',
    tags: ['Fabrika', 'Endüstriyel', 'GES']
  },
  {
    id: '3',
    title: 'Konyaaltı Rezidans Şarj Ağı',
    category: 'Şarj İstasyonu',
    city: 'Antalya',
    description: '20 araçlık AC şarj ağı altyapısı kurulumu.',
    imageUrl: '/images/3.jpeg',
    date: '2024-01-20',
    tags: ['Site', 'Şarj', 'Altyapı']
  },
  {
    id: '4',
    title: 'Urla Bağ Evi Off-Grid',
    category: 'Depolama',
    city: 'İzmir',
    description: 'Şebekeden bağımsız yaşam için tam off-grid sistem.',
    imageUrl: '/images/2.jpeg',
    date: '2023-06-10',
    tags: ['Off-Grid', 'Bağ Evi', 'Depolama']
  },
];

export const VIDEOS: any[] = [
  {
    id: 'v1',
    category: 'Tanıtım',
    title: 'North Enerji Vizyonu',
    description: 'Sürdürülebilir bir gelecek için attığımız adımlar. North Enerji olarak Türkiye\'nin enerji bağımsızlığına nasıl katkıda bulunduğumuzu keşfedin.',
    url: '/videos/tanıtım.mp4',
    poster: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop',
    duration: '02:30',
    tags: ['Kurumsal', 'Vizyon', 'Teknoloji']
  },
  {
    id: 'v2',
    category: 'Güneş Paneli',
    title: 'Villa ve İşletmeler',
    description: 'Güneş panelleri, villa ve işletmelerde elektrik maliyetlerini düşürür, enerji bağımsızlığı sağlar ve çevre dostu, uzun ömürlü bir yatırım sunar.',
    url: "/videos/Comp.mp4",
    poster: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop',
    duration: '04:15',
    tags: ['Verimlilik', 'Mühendislik', 'Fotovoltaik']
  },
  {
    id: 'v3',
    category: 'Araç Şarj İstasyonu',
    title: 'Müteahhit Ve Fabrika Sahipleri',
    description: 'Güneş panelleri, müteahhitler ve fabrika sahipleri için enerji maliyetlerini düşürür, projelere değer katar ve sürdürülebilir, uzun vadeli kazanç sağlar.',
    url: '/videos/mute.mp4',
    poster: '/images/asd.webp',
    duration: '03:45',
    tags: ['E-Mobilite', 'DC Şarj', 'Otomasyon']
  },
  {
    id: 'v4',
    category: 'Enerji Depolama',
    title: 'North İle Tasarruf',
    description: 'Elektrik kesintilerini tarihe gömün. Gündüz ürettiğiniz fazla enerjiyi depolayın, gece veya kesinti anında milisaniyeler içinde devreye giren sistemimizle hayatınıza kesintisiz devam edin.',
    url: '/videos/asdd.mp4',
    poster: '/images/aha.webp',
    duration: '05:20',
    tags: ['Off-Grid', 'LiFePO4', 'Güvenlik']
  },
];

export const MOCK_LEADS: Lead[] = [
    {
        id: 'L-102',
        monthlyBill: 2500,
        roofArea: 120,
        city: 'İstanbul',
        district: 'Kadıköy',
        wantsStorage: true,
        hasEV: false,
        usesHeatPump: false,
        phone: '532 123 45 67',
        status: 'new',
        createdAt: '2024-05-20T10:00:00Z',
        fullName: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        propertyType: 'home',
        source: 'web',
        // Detailed Info
        buildingSubtype: 'detached',
        roofType: 'pitched',
        roofMaterial: 'tile',
        shading: 'none',
        infrastructurePhase: 'monophase'
    },
    {
        id: 'WA-892',
        monthlyBill: 4500,
        roofArea: 200,
        city: 'Ankara',
        district: 'Çankaya',
        wantsStorage: false,
        hasEV: true,
        usesHeatPump: false,
        phone: '533 888 77 66',
        status: 'new',
        createdAt: '2024-05-21T08:15:00Z',
        fullName: 'Kemal Can',
        email: 'kemal.can@bot.com',
        propertyType: 'home',
        source: 'whatsapp', // Example WhatsApp Lead
        buildingSubtype: 'detached',
        roofType: 'flat',
        roofMaterial: 'concrete',
    },
    {
        id: 'L-101',
        monthlyBill: 8000,
        roofArea: 450,
        city: 'İzmir',
        district: 'Urla',
        wantsStorage: true,
        hasEV: true,
        usesHeatPump: true,
        phone: '555 987 65 43',
        status: 'contacted',
        createdAt: '2024-05-18T14:30:00Z',
        fullName: 'Ayşe Demir',
        email: 'ayse@example.com',
        propertyType: 'business',
        source: 'web',
        // Detailed Info
        buildingSubtype: 'plaza',
        operatingHours: 'day'
    }
];

export const MOCK_MESSAGES: ContactMessage[] = [
    {
        id: 'MSG-001',
        name: 'Mehmet Kaya',
        email: 'mehmet@test.com',
        phone: '0533 123 44 55',
        department: 'teknik',
        message: 'Mevcut invertörümde arıza var, teknik servis kaydı oluşturmak istiyorum.',
        createdAt: '2024-05-21T09:15:00Z',
        isRead: false
    },
    {
        id: 'MSG-002',
        name: 'Selin Yılmaz',
        email: 'selin@test.com',
        phone: '0544 987 66 33',
        department: 'satis',
        message: 'Otel projemiz için 250kW kapasiteli bir sistem teklifi almak istiyoruz.',
        createdAt: '2024-05-20T16:40:00Z',
        isRead: true
    }
];