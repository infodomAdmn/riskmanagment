import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    ShieldAlert,
    LayoutDashboard,
    FileText,
    Activity,
    AlertTriangle,
    AlertOctagon,
    GitBranch,
    Briefcase,
    Database,
    Award,
    Book,
    Target,
    BookOpen,
    Network,
    Menu,
    X,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import styles from './Layout.module.css';

interface NavItem {
    path: string;
    label: string;
    icon: any;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

const navGroups: NavGroup[] = [
    {
        label: 'Pregled',
        items: [
            { path: '/', label: 'Nadzorna ploča', icon: LayoutDashboard },
            { path: '/matrix', label: 'Matrica rizika', icon: LayoutDashboard },
            { path: '/canvas', label: 'Mapa rizika', icon: Network },
            { path: '/canvas-builder', label: 'Canvas Builder', icon: Network },
        ]
    },
    {
        label: 'Upravljanje rizicima',
        items: [
            { path: '/risks', label: 'Registar rizika', icon: ShieldAlert },
            { path: '/assessments', label: 'Procjene rizika', icon: Activity },
            { path: '/measures', label: 'Mjere ublažavanja', icon: FileText },
        ]
    },
    {
        label: 'Eventi i problemi',
        items: [
            { path: '/incidents', label: 'Incidenti', icon: AlertTriangle },
            { path: '/irregularities', label: 'Nepravilnosti', icon: AlertOctagon },
        ]
    },
    {
        label: 'Organizacija',
        items: [
            { path: '/processes', label: 'Poslovni procesi', icon: GitBranch },
            { path: '/projects', label: 'Projekti', icon: Briefcase },
            { path: '/assets', label: 'Imovina', icon: Database },
            { path: '/authorities', label: 'Ovlasti', icon: Award },
        ]
    },
    {
        label: 'Reference',
        items: [
            { path: '/regulations', label: 'Propisi', icon: Book },
            { path: '/plans', label: 'Planovi i ciljevi', icon: Target },
            { path: '/glossary', label: 'Rječnik pojmova', icon: BookOpen },
        ]
    }
];

export const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Pregled': true,
        'Upravljanje rizicima': true,
        'Eventi i problemi': false,
        'Organizacija': false,
        'Reference': false,
    });

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleGroup = (groupLabel: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupLabel]: !prev[groupLabel]
        }));
    };

    return (
        <div className={styles.container}>
            {/* Overlay for mobile */}
            <div
                className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
                onClick={closeSidebar}
            />

            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoGroup}>
                        <ShieldAlert className={styles.logo} />
                        <span className={styles.logo}>RiskManager</span>
                    </div>
                    <button className={styles.menuButton} onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>
                <nav className={styles.nav}>
                    {navGroups.map((group) => (
                        <div key={group.label} className={styles.navGroup}>
                            <button
                                className={styles.groupHeader}
                                onClick={() => toggleGroup(group.label)}
                            >
                                {expandedGroups[group.label] ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                                <span>{group.label}</span>
                            </button>
                            {expandedGroups[group.label] && (
                                <div className={styles.groupItems}>
                                    {group.items.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                                            }
                                        >
                                            <item.icon size={20} />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
            <main className={styles.main}>
                {/* Mobile menu button */}
                <button
                    className={styles.menuButton}
                    onClick={toggleSidebar}
                    style={{ marginBottom: '1rem' }}
                >
                    <Menu size={24} />
                </button>
                <Outlet />
            </main>
        </div>
    );
};
