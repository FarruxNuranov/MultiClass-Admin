export const scheduleData = [
  {
    grade: 11,
    classes: [
      { teacher: "Ziyoda Abdullayeva", class: "11A" },
      { teacher: "Asror Rashidov", class: "11B" },
    ],
  },
  {
    grade: 10,
    classes: [
      { teacher: "Alisher Saidov", class: "10A" },
      { teacher: "Sardorbek Rashidov", class: "10B" },
      { teacher: "Madina Karimova", class: "10C" },
    ],
  },
  {
    grade: 9,
    classes: [
      { teacher: "Ziyoda Abdullayeva", class: "9A" },
      { teacher: "Ali Normurodov", class: "9B" },
      { teacher: "Ahror Usmonov", class: "9C" },
      { teacher: "Javohir Rashidov", class: "9D" },
    ],
  },
  {
    grade: 8,
    classes: [
      { teacher: "Madina Karimova", class: "8A" },
      { teacher: "Sardor Karimov", class: "8B" },
      { teacher: "Shahnoza Yusupova", class: "8C" },
    ],
  },
];

// Список всех учителей
export const teachersData = [
  { id: 1, name: "Ziyoda Abdullayeva", subject: "Matematika" },
  { id: 2, name: "Asror Rashidov", subject: "Fizika" },
  { id: 3, name: "Alisher Saidov", subject: "Algebra" },
  { id: 4, name: "Sardorbek Rashidov", subject: "Kimyo" },
  { id: 5, name: "Madina Karimova", subject: "Biologiya" },
  { id: 6, name: "Ali Normurodov", subject: "Informatika" },
  { id: 7, name: "Ahror Usmonov", subject: "Tarix" },
  { id: 8, name: "Javohir Rashidov", subject: "Ingliz tili" },
  { id: 9, name: "Sardor Karimov", subject: "Ona tili" },
  { id: 10, name: "Shahnoza Yusupova", subject: "Jismoniy tarbiya" },
];

// Список предметов для расписания
export const subjectsData = [
  { id: 1, name: "Matematika" },
  { id: 2, name: "Algebra" },
  { id: 3, name: "Geometriya" },
  { id: 4, name: "Ingliz tili" },
  { id: 5, name: "Ona tili" },
  { id: 6, name: "Kimyo" },
  { id: 7, name: "Fizika" },
  { id: 8, name: "Biologiya" },
  { id: 9, name: "Informatika" },
  { id: 10, name: "Tarix" },
  { id: 11, name: "O‘zbekiston tarixi" },
  { id: 12, name: "Jahon tarixi" },
  { id: 13, name: "Jismoniy tarbiya" },
  { id: 14, name: "Huquq" },
];

// Уроки для расписания (по дням и времени)
export const lessonsData = [
  {
    class: "11A",
    day: "Du", // Понедельник
    start: "08:00",
    end: "08:45",
    subject: "Matematika",
    teacher: 1,
  },
  {
    class: "11A",
    day: "Du",
    start: "09:00",
    end: "09:45",
    subject: "Ingliz tili",
    teacher: 8,
  },
  {
    class: "11A",
    day: "Se", // Вторник
    start: "08:00",
    end: "08:45",
    subject: "Fizika",
    teacher: 2,
  },
  {
    class: "10B",
    day: "Chor", // Среда
    start: "10:00",
    end: "10:45",
    subject: "Kimyo",
    teacher: 4,
  },
  {
    class: "9C",
    day: "Pay", // Четверг
    start: "11:00",
    end: "11:45",
    subject: "Tarix",
    teacher: 7,
  },
];
