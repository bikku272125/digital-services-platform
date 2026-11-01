import React from 'react';
import {
  Sparkles,
  Palette,
  Layers,
  Vote,
  Cake,
  Briefcase,
  PartyPopper,
  Heart,
  GraduationCap,
  Image as ImageIcon
} from 'lucide-react';

export const CATEGORY_VISUALS = {
  'panchayat-community': {
    badge: 'Panchayat & Elections',
    accentColor: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
    icon: Vote,
    previewBg: 'from-amber-600 via-orange-600 to-amber-800',
    tagline: 'Authentic Gram Panchayat & Jan Sabha Designs',
    sampleImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=900&q=80',
    tags: ['Pradhan', 'Jan Sabha', 'Cleanliness Drive', 'Social Notice']
  },
  'birthday-anniversary': {
    badge: 'Celebrations & Wishes',
    accentColor: 'from-pink-500 to-rose-600',
    lightBg: 'bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400',
    icon: Cake,
    previewBg: 'from-pink-500 via-rose-500 to-purple-600',
    tagline: 'Warm Greetings with Golden Photo Frames',
    sampleImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80',
    tags: ['Birthday Banner', 'Silver Jubilee', 'Kids Theme', 'Family Portrait']
  },
  'business-advertisement': {
    badge: 'Commercial & Retail',
    accentColor: 'from-blue-600 to-indigo-700',
    lightBg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400',
    icon: Briefcase,
    previewBg: 'from-blue-600 via-indigo-600 to-slate-900',
    tagline: 'High-Conversion Promotional Adverts',
    sampleImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=900&q=80',
    tags: ['Grand Opening', 'Festive Sale', 'Menu Flyer', 'Shop Launch']
  },
  'festival-posters': {
    badge: 'Cultural Festivals',
    accentColor: 'from-orange-500 to-yellow-600',
    lightBg: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400',
    icon: PartyPopper,
    previewBg: 'from-orange-500 via-amber-600 to-red-700',
    tagline: 'Diwali, Holi, Eid, National Days & Pooja',
    sampleImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
    tags: ['Deepawali', 'Rangotsav', 'Patriotic Days', 'Spiritual Greetings']
  },
  'wedding-events': {
    badge: 'Royal Invitations',
    accentColor: 'from-red-600 to-purple-700',
    lightBg: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400',
    icon: Heart,
    previewBg: 'from-rose-700 via-red-800 to-amber-900',
    tagline: 'Traditional & Modern Vivah Nimantran',
    sampleImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
    tags: ['Vivah Nimantran', 'Ring Ceremony', 'Katha / Satsang', 'Save the Date']
  },
  'education': {
    badge: 'Academics & Institutes',
    accentColor: 'from-emerald-500 to-teal-700',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400',
    icon: GraduationCap,
    previewBg: 'from-teal-600 via-emerald-700 to-cyan-900',
    tagline: 'Admissions Open, Coaching & Merit Showcases',
    sampleImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    tags: ['Admissions Open', 'IIT-NEET Batch', 'Toppers Felicitation', 'Coaching Flyer']
  }
};

export function getVisualForCategory(slug) {
  return CATEGORY_VISUALS[slug] || {
    badge: 'Poster Category',
    accentColor: 'from-indigo-600 to-purple-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400',
    icon: Palette,
    previewBg: 'from-indigo-600 to-purple-800',
    tagline: 'Custom Designed Professional Graphic',
    sampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    tags: ['Custom Design', 'Hindi & English', 'HD Resolution']
  };
}
