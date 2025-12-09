"use client";

import styles from "./CategoryExplorer.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface CategoryCount {
    id: string;
    title: string;
    count: number;
}

interface CategoryExplorerProps {
    categoryCounts?: CategoryCount[];
}

const defaultCategories = [
    { id: "world", title: "World", bgClass: "bgWorld" },
    { id: "politics", title: "Politics", bgClass: "bgPolitics" },
    { id: "business", title: "Business", bgClass: "bgBusiness" },
    { id: "technology", title: "Technology", bgClass: "bgTech" }
];

const bgClassMap: { [key: string]: string } = {
    bgWorld: styles.bgWorld,
    bgPolitics: styles.bgPolitics,
    bgBusiness: styles.bgBusiness,
    bgTech: styles.bgTech
};

// Format article count for display
function formatArticleCount(count: number): string {
    if (count <= 0) return 'View articles';
    if (count <= 100) return `${count} articles`;
    if (count < 1000) return `${Math.floor(count / 100) * 100}+ articles`;
    if (count < 10000) return `${(count / 1000).toFixed(1)}k+ articles`;
    if (count < 1000000) return `${Math.floor(count / 1000)}k+ articles`;
    return `${(count / 1000000).toFixed(1)}M+ articles`;
}

export default function CategoryExplorer({ categoryCounts = [] }: CategoryExplorerProps) {
    const searchParams = useSearchParams();
    const currentTopic = searchParams.get('topic') || 'general';

    // Merge default categories with provided counts
    const categories = defaultCategories.map(cat => {
        const countData = categoryCounts.find(c => c.id === cat.id);
        const count = countData?.count || 0;
        const isActive = currentTopic === cat.id;
        return {
            ...cat,
            count,
            displayCount: formatArticleCount(count),
            // If clicking an active category, go back to default (no filter)
            link: isActive ? '/news' : `/news?topic=${cat.id}`,
            isActive
        };
    });

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
                    <Link 
                        href={cat.link} 
                        key={cat.id} 
                        className={`${styles.card} ${cat.isActive ? styles.cardActive : ''}`}
                    >
                        {/* Background Layer: Image (or gradient fallback) */}
                        <div className={`${styles.cardBackground} ${bgClassMap[cat.bgClass]}`}></div>

                        <div className={styles.cardOverlay}></div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{cat.title}</h3>
                            <span className={styles.cardCount}>
                                {cat.displayCount}
                            </span>
                        </div>

                        {/* Hover Icon - shows arrow on hover */}
                        <div className={styles.arrowIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Active indicator - checkmark when selected */}
                        {cat.isActive && (
                            <div className={styles.activeIndicator}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
}
