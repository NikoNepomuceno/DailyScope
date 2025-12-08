"use client";

import styles from "./CategoryExplorer.module.css";
import Link from "next/link";

const categories = [
    {
        id: "world",
        title: "World",
        count: "124 articles",
        bgClass: styles.bgWorld,
        link: "/news?topic=world"
    },
    {
        id: "politics",
        title: "Politics",
        count: "89 articles",
        bgClass: styles.bgPolitics,
        link: "/news?topic=politics"
    },
    {
        id: "business",
        title: "Business",
        count: "156 articles",
        bgClass: styles.bgBusiness,
        link: "/news?topic=business"
    },
    {
        id: "technology",
        title: "Technology",
        count: "203 articles",
        bgClass: styles.bgTech,
        link: "/news?topic=technology"
    }
];

export default function CategoryExplorer() {
    return (
        <section className={styles.section}>
            <header className={styles.header}>
                <div className={styles.eyebrow}>
                    <span className={styles.eyebrowLine}></span>
                    Browse by Topic
                    <span className={styles.eyebrowLine}></span>
                </div>
                <h2 className={styles.title}>
                    Explore <span className={styles.titleAccent}>Categories</span>
                </h2>
            </header>

            <div className={styles.grid}>
                {categories.map((cat) => (
                    <Link href={cat.link} key={cat.id} className={styles.card}>
                        {/* Background Layer: Image (or gradient fallback) */}
                        <div className={`${styles.cardBackground} ${cat.bgClass}`}></div>

                        <div className={styles.cardOverlay}></div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{cat.title}</h3>
                            <span className={styles.cardCount}>{cat.count}</span>
                        </div>

                        {/* Hover Icon */}
                        <div className={styles.arrowIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
