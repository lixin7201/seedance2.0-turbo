'use client';

import { useRef, useEffect, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  tags?: string[];
}

/**
 * Derive a poster URL from a video URL by replacing the extension with -poster.webp
 * e.g. /videos/showcase-racing.mp4 -> /videos/showcase-racing-poster.webp
 */
function getPosterUrl(videoUrl: string): string {
  return videoUrl.replace(/\.[^.]+$/, '-poster.webp');
}

function VideoPlayer({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn('h-full w-full rounded-2xl object-cover', className)}
      src={src}
      poster={getPosterUrl(src)}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}

/**
 * A simple hook that uses IntersectionObserver to trigger a CSS class
 * when the element scrolls into view, replicating framer-motion's whileInView.
 */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      options
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

export function ShowcaseGrid({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const items = (section.items as unknown as ShowcaseItem[]) || [];
  const headerView = useInView({ rootMargin: '-80px' });

  return (
    <section
      id={section.id || section.name}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div
          ref={headerView.ref}
          className={cn(
            'mb-12 text-center md:mb-16 transition-all duration-600 ease-out',
            headerView.isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-[30px]'
          )}
        >
          {section.label && (
            <span className="mb-3 inline-block rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
              {section.label}
            </span>
          )}
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-base md:text-lg">
              {section.description}
            </p>
          )}
        </div>

        {/* Alternating Grid */}
        <div className="space-y-8 md:space-y-12">
          {items.map((item, index) => {
            const isReversed = index % 2 === 1;
            return (
              <ShowcaseItem
                key={item.id || index}
                item={item}
                isReversed={isReversed}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShowcaseItem({
  item,
  isReversed,
}: {
  item: ShowcaseItem;
  isReversed: boolean;
}) {
  const containerView = useInView({ rootMargin: '-60px' });
  const videoView = useInView();
  const textView = useInView();

  return (
    <div
      ref={containerView.ref}
      className={cn(
        'group grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isReversed && 'md:[&>*:first-child]:order-2',
        containerView.isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-[40px]'
      )}
    >
      {/* Video */}
      <div
        ref={videoView.ref}
        className={cn(
          'relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl shadow-black/20 transition-all duration-600 delay-200',
          videoView.isInView
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95'
        )}
      >
        <VideoPlayer src={item.video_url} />
        {/* Subtle shimmer border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-indigo-500/30" />
      </div>

      {/* Text Content */}
      <div
        ref={textView.ref}
        className={cn(
          'flex flex-col justify-center space-y-4 transition-all duration-600 delay-300',
          textView.isInView
            ? 'opacity-100 translate-x-0'
            : `opacity-0 ${isReversed ? '-translate-x-[30px]' : 'translate-x-[30px]'}`
        )}
      >
        <h3 className="text-foreground text-xl font-semibold md:text-2xl lg:text-3xl">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {item.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
