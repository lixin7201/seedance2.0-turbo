'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  tags?: string[];
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
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export function ShowcaseGrid({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const items = (section.items as unknown as ShowcaseItem[]) || [];

  return (
    <section
      id={section.id || section.name}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
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
        </motion.div>

        {/* Alternating Grid */}
        <div className="space-y-8 md:space-y-12">
          {items.map((item, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.div
                key={item.id || index}
                className={cn(
                  'group grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16',
                  isReversed && 'md:[&>*:first-child]:order-2'
                )}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Video */}
                <motion.div
                  className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl shadow-black/20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <VideoPlayer src={item.video_url} />
                  {/* Subtle shimmer border on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-indigo-500/30" />
                </motion.div>

                {/* Text Content */}
                <motion.div
                  className="flex flex-col justify-center space-y-4"
                  initial={{
                    opacity: 0,
                    x: isReversed ? -30 : 30,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
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
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
