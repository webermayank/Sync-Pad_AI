import React, { useState, useEffect } from 'react';
import '../styles/WorkflowSection.css';

const WorkflowSection: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps = [
        {
            id: 'write',
            title: 'Write Text',
            description: 'Create or paste your content',
            icon: '📝',
            color: '#7c3aed',
            position: { x: 10, y: 50 }
        },
        {
            id: 'select',
            title: 'Select Content',
            description: 'Highlight the text you want to work with',
            icon: '🎯',
            color: '#2563eb',
            position: { x: 35, y: 50 }
        },
        {
            id: 'choose',
            title: 'Choose Action',
            description: 'Pick from AI-powered options',
            icon: '⚡',
            color: '#059669',
            position: { x: 60, y: 30 }
        },
        {
            id: 'results',
            title: 'Get AI Results',
            description: 'Receive intelligent suggestions',
            icon: '🤖',
            color: '#dc2626',
            position: { x: 85, y: 50 }
        }
    ];

    const actions = [
        { name: 'Summarize', color: '#a855f7', icon: '📋' },
        { name: 'Explain', color: '#3b82f6', icon: '💡' },
        { name: 'Enhance', color: '#10b981', icon: '✨' },
        { name: 'Translate', color: '#f59e0b', icon: '🌐' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
                setIsAnimating(false);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="workflow-section">
            <div className="workflow-background">
                <div className="workflow-orb-1"></div>
                <div className="workflow-orb-2"></div>
                <div className="workflow-orb-3"></div>
                <div className="workflow-particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="workflow-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="workflow-container">
                <div className="workflow-header">
                    <h2 className="workflow-title">How It Works</h2>
                    <p className="workflow-subtitle">
                        Experience the power of AI-assisted writing in four simple steps
                    </p>
                </div>

                <div className="workflow-canvas">
                    {/* Connection lines */}
                    <svg className="workflow-connections" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>

                        
                    </svg>

                    {/* Workflow steps */}
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`workflow-step ${activeStep === index ? 'active' : ''} ${isAnimating && activeStep === index ? 'animating' : ''}`}
                            style={{
                                left: `${step.position.x}%`,
                                top: `${step.position.y}%`,
                                '--step-color': step.color
                            } as React.CSSProperties}
                        >
                            <div className="step-node">
                                <div className="step-icon">{step.icon}</div>
                                <div className="step-pulse"></div>
                            </div>

                            <div className="step-content">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>

                            {activeStep === index && (
                                <div className="step-glow"></div>
                            )}
                        </div>
                    ))}

                    {/* Action options (visible when step 2 is active) */}
                    {activeStep === 2 && (
                        <div className="action-options">
                            {actions.map((action, index) => (
                                <div
                                    key={action.name}
                                    className="action-option"
                                    style={{
                                        '--action-color': action.color,
                                        animationDelay: `${index * 0.1}s`
                                    }as React.CSSProperties}
                                >
                                    <div className="action-icon">{action.icon}</div>
                                    <span className="action-name">{action.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* AI Results preview (visible when step 3 is active) */}
                    {activeStep === 3 && (
                        <div className="ai-results-preview">
                            <div className="results-header">
                                <div className="ai-avatar">🤖</div>
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                            <div className="results-content">
                                <div className="result-line" style={{ width: '100%' }}></div>
                                <div className="result-line" style={{ width: '85%' }}></div>
                                <div className="result-line" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Interactive demo */}
                <div className="workflow-demo">
                    <div className="demo-editor">
                        <div className="editor-header">
                            <div className="editor-controls">
                                <span className="control red"></span>
                                <span className="control yellow"></span>
                                <span className="control green"></span>
                            </div>
                            <span className="editor-title">AI Writing Assistant</span>
                        </div>

                        <div className="editor-content">
                            <div className="demo-text">
                                <span className={activeStep >= 1 ? 'highlighted' : ''}>
                                    The future of artificial intelligence holds immense potential for transforming how we work, create, and communicate.
                                </span>
                                {activeStep >= 3 && (
                                    <div className="ai-suggestion">
                                        <div className="suggestion-badge">AI Enhanced</div>
                                        <p>The revolutionary landscape of artificial intelligence presents unprecedented opportunities to fundamentally reshape our professional workflows, creative processes, and interpersonal communications.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step indicators */}
                <div className="step-indicators">
                    {steps.map((_, index) => (
                        <button
                            key={index}
                            className={`step-indicator ${activeStep === index ? 'active' : ''}`}
                            onClick={() => setActiveStep(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkflowSection;