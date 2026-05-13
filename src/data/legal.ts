export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export interface LegalDocument {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

export const privacyPolicy: LegalDocument = {
  title: 'Adatvédelmi tájékoztató',
  lastUpdated: '2026. május 13.',
  sections: [
    {
      heading: 'Az adatkezelő',
      paragraphs: [
        'Benett Car Business Kft. (székhely: 2700 Cegléd, Kőrösi út 01144/14.; e-mail: info@benettcar.hu; telefon: +36 20 240 1601) — a továbbiakban: Adatkezelő.',
      ],
    },
    {
      heading: 'Kezelt adatok és az adatkezelés célja',
      paragraphs: [
        'A weboldalon elérhető kapcsolatfelvételi űrlap kitöltésekor az alábbi személyes adatokat kezeljük: teljes név, telefonszám, e-mail cím, valamint az üzenet szövege.',
        'Az adatkezelés célja: az érintett megkeresésének megválaszolása, időpont- és visszahívás-egyeztetés, ajánlatkérés teljesítése.',
      ],
    },
    {
      heading: 'Az adatkezelés jogalapja',
      paragraphs: [
        'Az adatkezelés jogalapja az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont). A hozzájárulás az űrlap elküldésével adható meg, és bármikor visszavonható.',
      ],
    },
    {
      heading: 'Az adatok megőrzési ideje',
      paragraphs: [
        'A megkeresés lezárásától számított legfeljebb 1 (egy) évig őrizzük meg a személyes adatokat, ezt követően azokat töröljük.',
      ],
    },
    {
      heading: 'Adattovábbítás',
      paragraphs: [
        'Az Adatkezelő a személyes adatokat harmadik félnek nem adja át, kivéve jogszabályi kötelezettség esetén.',
      ],
    },
    {
      heading: 'Az érintett jogai',
      paragraphs: [
        'Az érintett jogosult: hozzáférni a róla kezelt adatokhoz, kérni azok helyesbítését vagy törlését, kérni az adatkezelés korlátozását, valamint adathordozhatósághoz való jogát érvényesíteni.',
        'Kérelmét az info@benettcar.hu e-mail-címre vagy postai úton (2700 Cegléd, Kőrösi út 01144/14.) juttathatja el. Az Adatkezelő a kérelemre 30 napon belül válaszol.',
      ],
    },
    {
      heading: 'Jogorvoslat',
      paragraphs: [
        'Adatkezelési panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH) fordulhat: cím: 1055 Budapest, Falk Miksa u. 9-11.; weboldal: naih.hu.',
      ],
    },
  ],
}

export const termsOfService: LegalDocument = {
  title: 'Általános Szerződési Feltételek',
  lastUpdated: '2026. május 13.',
  sections: [
    {
      heading: 'A szolgáltató adatai',
      paragraphs: [
        'Benett Car Business Kft. (székhely: 2700 Cegléd, Kőrösi út 01144/14.; e-mail: info@benettcar.hu; telefon: +36 20 240 1601) — a továbbiakban: Szolgáltató.',
      ],
    },
    {
      heading: 'A szolgáltatások köre',
      paragraphs: [
        'A Szolgáltató az alábbi tevékenységeket végzi: ellenőrzött járműbeszerzés és értékesítési támogatás, műszaki állapotfelmérés és diagnosztika, autóbérlés, útmenti segítségnyújtás.',
        'A szolgáltatások a Volkswagen-konszern márkáira (Volkswagen, Audi, Škoda, Porsche, Lamborghini, Bugatti) specializáltan, de nem kizárólagosan érhetők el.',
      ],
    },
    {
      heading: 'Időpontfoglalás és kapcsolatfelvétel',
      paragraphs: [
        'Az oldalon elérhető kapcsolatfelvételi űrlapon, telefonon vagy e-mailben egyeztethető időpont. Az időpont-visszaigazolás e-mailben vagy telefonon történik.',
        'A Szolgáltató fenntartja a jogot, hogy visszaigazolás előtt az időpontot ne tekintse foglaltnak.',
      ],
    },
    {
      heading: 'Díjak és fizetési feltételek',
      paragraphs: [
        'A szolgáltatások díja egyedi ajánlat alapján kerül meghatározásra. Az árajánlat a Szolgáltató írásbeli visszaigazolásával válik kötelező érvényűvé.',
        'A Szolgáltató a díjakat a teljesítést követően, a megállapodott fizetési mód szerint számlázza ki.',
      ],
    },
    {
      heading: 'Állapotfelmérés és felelősség',
      paragraphs: [
        'A műszaki állapotfelmérés szakmai véleményt jelent a jármű vizsgálat időpontjában fennálló állapotáról. Az állapotfelmérés nem minősül vásárlási garanciának, és nem terjed ki a vizsgálat során nem észlelhető, rejtett hibákra.',
        'A Szolgáltató az általa okozott közvetlen károkért a Polgári Törvénykönyv szabályai szerint felel. Közvetett kár, elmaradt haszon, illetve piaci értékveszteség megtérítésére a Szolgáltató nem kötelezhető.',
      ],
    },
    {
      heading: 'Szellemi tulajdon',
      paragraphs: [
        'A weboldal tartalma — szövegek, képek, logók, grafikai elemek — a Benett Car Business Kft. szellemi tulajdonát képezi. Azok engedély nélküli felhasználása tilos.',
      ],
    },
    {
      heading: 'Irányadó jog és jogvita',
      paragraphs: [
        'Jelen ÁSZF-re a magyar jog az irányadó. Felek a jogviták rendezésére elsősorban egyeztetést kísérelnek meg; megállapodás hiányában a hatáskörrel és illetékességgel rendelkező magyar bíróság dönt.',
        'Fogyasztói jogvita esetén az érintett a területileg illetékes békéltető testülethez fordulhat.',
      ],
    },
  ],
}
