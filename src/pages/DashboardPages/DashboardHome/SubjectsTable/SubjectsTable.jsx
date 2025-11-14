import React, { useMemo, useState } from "react";
import s from "./SubjectsTable.module.scss";
import { useTranslation } from "react-i18next";

const defaultRows = [
  { name: "Matematika", avg: 4.9 },
  { name: "Fizika", avg: 4.8 },
  { name: "Informatika", avg: 4.8 },
  { name: "Tarix", avg: 4.7 },
  { name: "Ona tili", avg: 4.5 },
  { name: "Adabiyot", avg: 4.0 },
  { name: "Kimyo", avg: 4.0 },
  { name: "Biologiya", avg: 3.9 },
  { name: "Geografiya", avg: 3.9 },
];

const SubjectsTable = ({ title, rows = defaultRows }) => {
  const { t } = useTranslation();
  const [sortDir, setSortDir] = useState(null); // null | "asc" | "desc"

  const sorted = useMemo(() => {
    if (!sortDir) return rows;
    return [...rows].sort((a, b) =>
      sortDir === "asc" ? a.avg - b.avg : b.avg - a.avg
    );
  }, [rows, sortDir]);

  const toggleSort = () =>
    setSortDir((p) => (p === "asc" ? "desc" : p === "desc" ? null : "asc"));

  return (
    <div className={s.card}>
      <div className={s.header}>
        <h3>{title || t("subjectsResults")}</h3>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>{t("subjectName")}</th>
              <th onClick={toggleSort} className={s.sortable}>
                {t("averageScore")}
                <span
                  className={`${s.chev} ${
                    sortDir === "asc" ? s.asc : ""
                  } ${sortDir === "desc" ? s.desc : ""}`}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={`${r.name}-${i}`}>
                <td>{r.name}</td>
                <td>{r.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsTable;