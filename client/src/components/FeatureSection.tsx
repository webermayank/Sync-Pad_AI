import React from 'react';
import '../styles/FeatureSection.css';
import awsicon from '../assets/AWS.png';
import dashboardIcon from '../assets/Dashboard.png';
import aiIcon from '../assets/ArtificialIntelli.png';

interface CardProps {
    title: string;
    subtitle: string;
    description: string;
    icon :string;
}

const cards: CardProps[] = [
    {
        title: 'Secure Cloud File Saving',
        subtitle: 'Fast & Encrypted',
        description:
            'Upload documents, collaborate in real‑time, and protect your data with zero‑knowledge encryption. Access it anywhere.',
        icon: awsicon,
    },
    {
        title: 'Personalized Dashboard',
        subtitle: 'Your Workflow, Your Way',
        description:
            'Customize widgets, track tasks, monitor project status, and get AI‑driven suggestions in one unified view.',
        icon: dashboardIcon,
    },
    {
        title: 'AI‑Powered Insights',
        subtitle: 'Smart Analytics',
        description:
            'Leverage AI to surface trends, predict outcomes, and make data‑driven decisions without leaving your dashboard.',
        icon: aiIcon,
    },
];

export const FeatureCards: React.FC = () => {
    return (
        <section className="fc-section">
            <div className="fc-grid">
                {cards.map(({ title, subtitle, description, icon }) => (
                    <div key={title} className="fc-card">
                        <img src={icon} className="fc-icon" />
                        <h4 className="fc-title">{title}</h4>
                        <p className="fc-subtitle">{subtitle}</p>
                        <p className="fc-desc">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeatureCards;
