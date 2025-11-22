import HeroImage from '@/components/React/features/landing/components/HeroImage';
import Challenge from '@/components/React/features/landing/components/Challenge';
import ChartingFeatures from '@/components/React/features/landing/components/ChartingFeatures';
import { useBodyLock } from '@/hooks/useBodyLock';
import LazyHydrationSection from '@/components/React/features/landing/containers/LazyHydrationSection';
import { useExtractionFlag } from '@/hooks/flags/useExtractonFlag';
import { useCachePosts } from '@/hooks/caching/useCachePosts';

export default function Home({ }) {
    useCachePosts();
    useBodyLock();
    useExtractionFlag();

    return (
        <section className="flex h-auto flex-col gap-y-0 md:gap-y-20 w-full grow scroll-smooth">
            <HeroImage />
            <ChartingFeatures />
            <Challenge />
            <LazyHydrationSection />
        </section>
    );
};


