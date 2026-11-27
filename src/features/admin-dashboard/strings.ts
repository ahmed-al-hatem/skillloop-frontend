import type { BookingStatus } from './schemas/adminDashboard.schema';

/** UI text of the admin dashboard, in one place so it moves easily to i18n later. */
export const dashboardStrings = {
  overline: 'نظرة عامة على المنصة',
  greeting: 'مرحباً بعودتك 👋',
  loadError: 'تعذّر تحميل أرقام لوحة المؤشرات',
  emptyTitle: 'لا توجد بيانات بعد',
  emptyDescription: 'ستظهر الأرقام هنا عندما يسجّل أول عضو.',
  points: {
    title: 'النقاط المتداولة',
    hint: 'المتاحة + المحجوزة لكل الأعضاء',
    perActiveMember: (value: string) => `${value} لكل عضو نشط`,
  },
  verification: {
    title: 'توثيق الأعضاء',
    verified: 'موثّق',
    unverified: 'غير موثّق',
    percent: (value: string) => `${value}%`,
  },
  metrics: {
    members: 'الأعضاء',
    activeServices: 'الخدمات النشطة',
    activeMembers30d: 'نشطون (30 يوماً)',
    suspended: 'موقوفون',
  },
  bookings: {
    title: 'الحجوزات',
    total: 'إجمالي الحجوزات',
    groups: {
      inProgress: 'جارية',
      done: 'منتهية',
      disputed: 'في نزاع',
      closed: 'ملغاة أو مرفوضة',
    },
  },
  attention: {
    title: 'بحاجة لانتباهك',
    openDisputes: 'نزاعات مفتوحة',
    openDisputesHint: 'بانتظار قرار المدير',
    pendingSuggestions: 'اقتراحات تصنيفات',
    pendingSuggestionsHint: 'أسماء «أخرى» بانتظار المراجعة',
    needsReview: 'تحتاج مراجعة',
    allClear: 'لا شيء',
  },
  bookingStatus: {
    PENDING: 'بانتظار الرد',
    ACCEPTED: 'مقبول',
    DELIVERED: 'تم الإنجاز',
    DISPUTED: 'في نزاع',
    COMPLETED: 'مكتمل',
    RESOLVED: 'محلول',
    DECLINED: 'مرفوض',
    CANCELLED: 'ملغى',
  } satisfies Record<BookingStatus, string>,
} as const;
