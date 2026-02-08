'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/shared/components/ui/button';
import { Link } from '@/core/i18n/navigation';
import { Crown, Sparkles, ArrowRight, Gift } from 'lucide-react';

export default function PaymentSuccessPage() {
  const t = useTranslations('pages.payment_success');
  const confettiTriggered = useRef(false);

  const fireConfetti = useCallback(() => {
    // 撒花动画 - 多次发射
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // 第一波：大量彩纸
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      scalar: 0.8,
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    });

    fire(0.2, {
      spread: 60,
      colors: ['#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE'],
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FF6B6B', '#C44569', '#F8B739', '#00D2D3'],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#FD79A8', '#FDCB6E', '#00CEC9', '#6C5CE7'],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#E17055', '#00B894', '#0984E3', '#B2BEC3'],
    });

    // 延迟第二波
    setTimeout(() => {
      fire(0.15, {
        spread: 150,
        startVelocity: 30,
        decay: 0.94,
        scalar: 1.1,
        origin: { x: 0.2, y: 0.5 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
      });

      fire(0.15, {
        spread: 150,
        startVelocity: 30,
        decay: 0.94,
        scalar: 1.1,
        origin: { x: 0.8, y: 0.5 },
        colors: ['#45B7D1', '#96CEB4', '#FFEAA7'],
      });
    }, 400);

    // 延迟第三波 - 星星特效
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 180,
        startVelocity: 30,
        origin: { y: 0.3 },
        shapes: ['star'],
        colors: ['#FFD700', '#FFA500', '#FF6347'],
        scalar: 1.5,
        zIndex: 9999,
      });
    }, 800);
  }, []);

  useEffect(() => {
    if (!confettiTriggered.current) {
      confettiTriggered.current = true;
      // 页面加载后立即触发撒花
      setTimeout(fireConfetti, 300);
      // 2秒后再次触发
      setTimeout(fireConfetti, 2500);
    }
  }, [fireConfetti]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 光晕效果 */}
        <div className="absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-yellow-400/30 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 animate-pulse rounded-full bg-cyan-400/20 blur-3xl" />
        
        {/* 星星装饰 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="mb-8"
        >
          <div className="relative">
            {/* 光环效果 */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.2, 0.5] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ filter: 'blur(20px)' }}
            />
            
            {/* 皇冠图标 */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-2xl">
              <Crown className="h-14 w-14 text-white drop-shadow-lg" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-4 text-center text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl"
        >
          {t('title')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-8 flex items-center gap-2"
        >
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <span className="text-lg text-white/90 md:text-xl">
            {t('subtitle')}
          </span>
          <Sparkles className="h-5 w-5 text-yellow-300" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-12 max-w-lg text-center text-white/80"
        >
          {t('description')}
        </motion.p>

        {/* 会员权益卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mb-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <Gift className="h-6 w-6 text-yellow-300" />
            <h3 className="text-lg font-semibold text-white">{t('benefits_title')}</h3>
          </div>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              {t('benefit_1')}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              {t('benefit_2')}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              {t('benefit_3')}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              {t('benefit_4')}
            </li>
          </ul>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 px-8 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:from-yellow-500 hover:to-orange-600"
          >
            <Link href="/ai-video-generator">
              {t('start_button')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 px-8 text-lg font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
          >
            <Link href="/settings/account">
              {t('account_button')}
            </Link>
          </Button>
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-12 text-center text-sm text-white/50"
        >
          {t('support_text')}
        </motion.p>
      </div>
    </div>
  );
}
