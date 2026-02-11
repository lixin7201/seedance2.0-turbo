'use client';

import { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { Highlighter } from '@/shared/components/ui/highlighter';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

/**
 * Derive a poster URL from a video URL by replacing the extension with -poster.webp
 * e.g. /videos/hero-bg.mp4 -> /videos/hero-bg-poster.webp
 */
function getPosterUrl(videoUrl: string): string {
  return videoUrl.replace(/\.[^.]+$/, '-poster.webp');
}

export function HeroVideo({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const highlightText = section.highlight_text ?? '';
  let texts = null;
  if (highlightText) {
    texts = section.title?.split(highlightText, 2);
  }

  return (
    <section
      id={section.id}
      className={cn(
        'relative flex min-h-[100vh] items-center justify-center overflow-hidden',
        section.className,
        className
      )}
    >
      {/* Video Background */}
      {section.video_url && (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={section.video_url as string}
            poster={getPosterUrl(section.video_url as string)}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
      )}

      {/* Fallback solid bg when no video */}
      {!section.video_url && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {section.announcement && (
          <div
            className="animate-[fadeSlideDown_0.6s_ease-out_both]"
          >
            <Link
              href={section.announcement.url || ''}
              target={section.announcement.target || '_self'}
              className="group mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/20"
            >
              <span>{section.announcement.title}</span>
              <span className="h-4 w-px bg-white/30" />
              <div className="flex size-5 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                <ArrowRight className="size-3" />
              </div>
            </Link>
          </div>
        )}

        <div
          className="animate-[fadeSlideUp_0.8s_ease-out_0.2s_both]"
        >
          {texts && texts.length > 0 ? (
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {texts[0]}
              <Highlighter action="underline" color="#FF9800">
                {highlightText}
              </Highlighter>
              {texts[1]}
            </h1>
          ) : (
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {section.title}
            </h1>
          )}
        </div>

        <p
          className="mx-auto mt-6 max-w-2xl text-base text-white/70 sm:text-lg md:mt-8 md:text-xl animate-[fadeSlideUp_0.8s_ease-out_0.4s_both]"
          dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
        />

        {section.buttons && (
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10 animate-[fadeSlideUp_0.8s_ease-out_0.6s_both]"
          >
            {section.buttons.map((button, idx) => (
              <Button
                asChild
                size="lg"
                variant={button.variant || 'default'}
                className={cn(
                  'px-6 py-3 text-base font-medium',
                  idx === 0
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700'
                    : 'border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                )}
                key={idx}
              >
                <Link href={button.url ?? ''} target={button.target ?? '_self'}>
                  {button.icon && <SmartIcon name={button.icon as string} />}
                  <span>{button.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}

        {section.tip && (
          <p
            className="mt-6 text-sm text-white/50 animate-[fadeIn_0.8s_ease-out_0.8s_both]"
            dangerouslySetInnerHTML={{ __html: section.tip ?? '' }}
          />
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 z-10 h-32 w-full bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
