import React from 'react';
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
    Network
} from 'lucide-react';
import styles from './Layout.module.css';

const navItems = [
    { path: '/', label: 'Nadzorna ploča', icon: LayoutDashboard },
    { path: '/canvas', label: 'Mapa rizika', icon: Network },
    { path: '/risks', label: 'Registar rizika', icon: ShieldAlert },
    { path: '/assessments', label: 'Procjene rizika', icon: Activity },
    { path: '/measures', label: 'Mjere ublažavanja', icon: FileText },
    { path: '/incidents', label: 'Incidenti', icon: AlertTriangle },
    { path: '/irregularities', label: 'Nepravilnosti', icon: AlertOctagon },
    { path: '/processes', label: 'Poslovni procesi', icon: GitBranch },
    { path: '/projects', label: 'Projekti', icon: Briefcase },
    { path: '/assets', label: 'Imovina', icon: Database },
    { path: '/authorities', label: 'Ovlasti', icon: Award },
    { path: '/regulations', label: 'Propisi', icon: Book },
    { path: '/plans', label: 'Planovi i ciljevi', icon: Target },
    { path: '/glossary', label: 'Rječnik pojmova', icon: BookOpen },
];

export const Layout: React.FC = () => {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <ShieldAlert className={styles.logo} />
                    <span className={styles.logo}>RiskManager</span>
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};
