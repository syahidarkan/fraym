import React from 'react'
import { HeroSection, FeaturesSection, CTASection, FAQSection, DemoSection, TextSection } from '../Marketing/Sections'

const SectionMap: any = {
    hero: HeroSection,
    features: FeaturesSection,
    cta: CTASection,
    faq: FAQSection,
    demo: DemoSection,
    text: TextSection
};

export default function PageRenderer({ sections }: { sections: any[] }) {
    if (!sections || sections.length === 0) return null;

    return (
        <>
            {sections.map((section) => {
                if (!section.isVisible) return null;
                const Component = SectionMap[section.type];
                if (!Component) return null;
                return <Component key={section.id} content={section.content} />;
            })}
        </>
    )
}
