// src/data/fakeLessons.js

const subjects = [
  { subject: "Matematika", teacher: "Alisher Saidov", color: "#f3e8ff" },
  { subject: "Ona tili", teacher: "Ziyoda Abdullayeva", color: "#dbeafe" },
  { subject: "Tarix", teacher: "Ahror Usmonov", color: "#fee2e2" },
  { subject: "Informatika", teacher: "Ali Normurodov", color: "#dcfce7" },
  { subject: "Kimyo", teacher: "Madina Karimova", color: "#fef3c7" },
  { subject: "Fizika", teacher: "Asror Rashidov", color: "#bae6fd" },
  { subject: "Biologiya", teacher: "Madina Karimova", color: "#bbf7d0" },
  { subject: "Ingliz tili", teacher: "Javohir Rashidov", color: "#e0f2fe" },
  { subject: "Geometriya", teacher: "Alisher Saidov", color: "#fde68a" },
  { subject: "Jismoniy tarbiya", teacher: "Shahnoza Yusupova", color: "#fecaca" },
];

const times = [
  "08:00–08:45",
  "09:00–09:45",
  "10:00–10:45",
  "11:00–11:45",
  "12:00–12:45",
  "13:00–13:45",
  "14:00–14:45",
];

// 🔹 Генерация случайных уроков
function randomLessons() {
  const count = Math.floor(Math.random() * 4) + 3; // 3–6 уроков
  return Array.from({ length: count }, (_, i) => {
    const subj = subjects[Math.floor(Math.random() * subjects.length)];
    return {
      ...subj,
      time: times[i % times.length],
    };
  });
}

// 🔹 Генерация уроков на месяц (1–31 января 2025)
export const fakeLessons = {};
for (let day = 1; day <= 31; day++) {
  fakeLessons[`2025-01-${String(day).padStart(2, "0")}`] = randomLessons();
}