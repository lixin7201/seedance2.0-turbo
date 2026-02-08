'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, Sparkles } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';
import { Link } from '@/core/i18n/navigation';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail: string;
  duration?: string;
  style?: string;
  tags?: string[];
  prompt?: string;
}

// Video Card Component
function VideoCard({
  item,
  index,
  onPlay,
}: {
  item: VideoItem;
  index: number;
  onPlay: (item: VideoItem) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card
        className="group relative cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onPlay(item)}
      >
        <CardContent className="p-0">
          {/* Video/Thumbnail Container */}
          <div className="relative aspect-video w-full overflow-hidden">
            {/* Thumbnail Image */}
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                'object-cover transition-all duration-500',
                isHovering ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
              )}
            />

            {/* Preview Video (shown on hover) */}
            <video
              ref={videoRef}
              src={item.video_url}
              muted
              loop
              playsInline
              preload="none"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                isHovering ? 'opacity-100' : 'opacity-0'
              )}
            />

            {/* Preview Example Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-primary/90 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Preview Example
              </span>
            </div>

            {/* Duration Badge */}
            {item.duration && (
              <div className="absolute right-3 bottom-3 z-10">
                <span className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </span>
              </div>
            )}

            {/* Play Button Overlay */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300',
                isHovering ? 'opacity-100' : 'opacity-0'
              )}
            >
              <motion.div
                className="bg-primary flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isHovering ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Play className="ml-1 h-7 w-7" fill="white" />
              </motion.div>
            </div>

            {/* Gradient Overlay for Title */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Card Info */}
          <div className="p-4">
            <h3 className="mb-1 line-clamp-1 text-lg font-semibold">
              {item.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {item.description}
            </p>

            {/* Style/Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Video Modal Component
function VideoModal({
  video,
  isOpen,
  onClose,
}: {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="bg-card relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="bg-background/80 hover:bg-background absolute top-4 right-4 z-20 rounded-full p-2 transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src={video.video_url}
                controls
                autoPlay
                className="h-full w-full"
                playsInline
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold">{video.title}</h3>
              <p className="text-muted-foreground mb-4">{video.description}</p>

              {video.prompt && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                    Prompt Used
                  </p>
                  <p className="text-sm italic">&quot;{video.prompt}&quot;</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Video Showcase Component
export function VideoShowcase({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = (section.items as VideoItem[]) || [];
  const viewAllButton = (section as any).view_all_button;

  const handlePlayVideo = useCallback((video: VideoItem) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  }, []);

  // Handle ESC key to close modal
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isModalOpen) {
          handleCloseModal();
        }
      },
      [isModalOpen, handleCloseModal]
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    });
  }

  return (
    <>
      <section
        id={section.id || 'video-showcase'}
        className={cn('py-24 md:py-36', section.className, className)}
      >
        {/* Section Header */}
        <motion.div
          className="container mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {section.sr_only_title && (
            <h1 className="sr-only">{section.sr_only_title}</h1>
          )}
          <h2 className="mx-auto mb-6 max-w-full text-3xl font-bold text-pretty md:max-w-5xl lg:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground text-md mx-auto mb-4 max-w-full md:max-w-3xl">
            {section.description}
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <VideoCard
              key={item.id}
              item={item}
              index={index}
              onPlay={handlePlayVideo}
            />
          ))}
        </div>

        {/* View All Button */}
        {viewAllButton && (
          <motion.div
            className="container mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Button asChild variant="outline" size="lg">
              <Link href={viewAllButton.url || '/showcases'}>
                {viewAllButton.title}
              </Link>
            </Button>
          </motion.div>
        )}
      </section>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
