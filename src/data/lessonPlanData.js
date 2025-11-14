// src/data/lessonPlanData.js
export const lessonPlanData = [
  { class: "11A", teacher: "Ziyoda Abdullayeva", grade: 11 },
  { class: "11B", teacher: "Asror Rashidov", grade: 11 },
  { class: "10A", teacher: "Alisher Saidov", grade: 10 },
  { class: "10B", teacher: "Sardorbek Rashidov", grade: 10 },
  { class: "10C", teacher: "Madina Karimova", grade: 10 },
  { class: "9A", teacher: "Ziyoda Abdullayeva", grade: 9 },
  { class: "9B", teacher: "Ali Normurodov", grade: 9 },
  { class: "9C", teacher: "Ahror Usmonov", grade: 9 },
  { class: "9D", teacher: "Javohir Rashidov", grade: 9 },
];

export const plans = [
  {
    id: 1,
    title:
      "Trigonometriya: Trigonometriya identitetlari va ularning qo‘llanilishi.",
    date: "January 1, 2023",
    status: "O‘tilgan",
  },
  {
    id: 2,
    title:
      "Trigonometriya: Sinus, kosinus va tangens funksiyalarining qo‘llanilishi.",
    date: "January 2, 2023",
    status: "O‘tilgan",
  },
  {
    id: 3,
    title: "Trigonometriya: Hayotimizda trigonometriyaning ahamiyati.",
    date: "January 3, 2023",
    status: "Rejalangan",
  },
  {
    id: 4,
    title: "Trigonometriya: Dairaviy funksiyalar va ularning grafiklari.",
    date: "January 4, 2023",
    status: "Rejalangan",
  },
  {
    id: 5,
    title: "Trigonometriya: Uchburchaklar turlari va ularning xususiyatlari.",
    date: "January 5, 2023",
    status: "Rejalangan",
  },
  {
    id: 6,
    title: "Trigonometriya: Uchburchak o‘lchovlari va burchaklarni hisoblash.",
    date: "January 6, 2023",
    status: "Rejalangan",
  },
  {
    id: 7,
    title: "Trigonometriya: Trigonometriya tenglamalari va ularning yechimi.",
    date: "January 7, 2023",
    status: "Rejalangan",
  },
];

export const fakeLessonDetails = {
  id: 1,
  title:
    "Trigonometriya: Trigonometriya identitetlari va ularning qo‘llanilishi",
  date: "January 1, 2023",
  status: "O‘tilgan",
  time: "12:00 – 12:45",
  room: "A-building, 203-xona",
  description: `
    Bu darsda biz trigonometriya asoslari va trigonometrik identitetlarni 
    amaliyotda qo‘llashni o‘rganamiz. Quyidagi asosiy jihatlar muhokama qilinadi:
  `,
  bullets: [
    "Ikkita sinus va kosinus formulalari",
    "Tangens va kotangens identitetlari",
    "Hayotiy masalalarda trigonometrik formulalarning ishlatilishi",
    "Geometriya va fizika fanlarida trigonometriya qo‘llanilishi",
  ],
  audience: `
    Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.
Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.
Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.
  `,
  success: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque tellus vel pretium posuere. Id maecenas a tristique in fusce hendrerit. Amet, mattis in vitae, est urna, diam. Ante fringilla nulla at sed tincidunt. Et aliquam neque cras mauris non bibendum. Hac ut ridiculus enim urna felis amet. Dolor aliquam diam suspendisse non elit faucibus id orci, mi.
Pharetra nam gravida commodo accumsan sapien aliquet bibendum purus nunc. Quam cursus at eu, aliquam integer. Accumsan, nisi ultricies ut pulvinar fames neque risus. Eu et, elementum leo amet bibendum gravida vitae ridiculus.
  `,
  images: [
    "https://picsum.photos/400/250?random=11",
    "https://picsum.photos/400/250?random=22",
    "https://picsum.photos/400/250?random=33",
  ],
  materials: [
    { name: "Trigonometriya identitetlari.pdf", size: "1.2 MB", type: "pdf" },
    { name: "Dars slaydlari.pptx", size: "3.4 MB", type: "ppt" },
    { name: "Trigonometriya mashqlar.docx", size: "820 KB", type: "docx" },
    { name: "Hisoblash jadvallari.xlsx", size: "600 KB", type: "xls" },
    { name: "Dars yozuvi.mp4", size: "45 MB", type: "mp4" },
    { name: "Podkast.mp3", size: "18 MB", type: "mp3" },
 
    
  ],
};
