import React, { useEffect, useState } from "react";
import styles from "./singleSchool.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTenantByIdApi } from "../../../../App/Api/tenants/tenantsApi";

const SingleSchool = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchSchool = async () => {
      try {
        setLoading(true);
        const res = await fetchTenantByIdApi(id);
        setSchool(res.data); // API dan kelgan data
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Maktab ma'lumotlarini olishda xatolik yuz berdi");
        setLoading(false);
      }
    };

    fetchSchool();
  }, [id]);

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;
  if (error) return <p style={{ padding: 16, color: "red" }}>{error}</p>;
  if (!school) return null;

  return (
    <div className={styles.page}>
      {/* Верхний градиент */}
      <div className={styles.headerBg}></div>

      {/* Хэдер */}
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.avatarPlaceholder}></div>
          <div>
            <div className={styles.breadcrumbs}></div>
            <h1 className={styles.name}>{school.title}</h1>
            <p className={styles.email}>{school.note || "Izoh mavjud emas"}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => navigate(`#`)}>Tahrirlash</button>
          <button className={styles.exportBtn}>Export</button>
        </div>
      </div>

      {/* Информация */}
      <div className={styles.infoSection}>
        <div className={styles.leftInfo}>
          <p className={styles.label}>Status</p>
          <p className={styles.value} style={{ color: school.status === "active" ? "green" : "red", textTransform: "capitalize" }}>
            {school.status}
          </p>

          <p className={styles.label}>Balance</p>
          <p className={styles.value}>{school.balance}</p>

          <p className={styles.label}>Discount</p>
          <p className={styles.value}>{school.discount}</p>

          <p className={styles.label}>Yaratilgan sana</p>
          <p className={styles.value}>{new Date(school.createdAt).toLocaleDateString("uz-UZ")}</p>
        </div>

        <div className={styles.rightInfo}>
          <h3>Qisqacha ma'lumot</h3>
          <p>{school.note || "Izoh mavjud emas"}</p>
        </div>
      </div>

      {/* O'quv baholari (statik) */}
      <div className={styles.infoSection}>
        <div className={styles.leftInfo}>
          <h3>Fanlar</h3>
        </div>
        <div className={styles.rightInfo}>
          <table className={styles.subjectsTable}>
            <thead>
              <tr>
                <th>Fan</th>
                <th>Baho</th>
                <th>O'rtacha baho</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Matematika</td>
                <td>
                  <span className={styles.grade + " " + styles.good}>5</span>
                  <span className={styles.grade + " " + styles.medium}>4</span>
                </td>
                <td><span className={styles.grade + " " + styles.good}>4.5</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hujjatlar (statik) */}
      <div className={styles.docsSection}>
        <div className={styles.docsLeft}>
          <h3>Hujjatlar</h3>
        </div>
        <div className={styles.docsRight}>
          <div className={styles.docsGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.docCard}>
                <img
                  src={`https://picsum.photos/400/250?random=${i + 50}`}
                  alt={`Hujjat ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSchool;
