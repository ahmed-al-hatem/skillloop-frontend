import type { BookingStatus } from './schemas/adminDashboard.schema';

/** UI text of the admin dashboard, in one place so it moves easily to i18n later. */
export const dashboardStrings = {
  title: 'لوحة المؤشرات',
  loadError: 'تعذّر تحميل أرقام لوحة المؤشرات',
  emptyTitle: 'لا توجد بيانات بعد',
  emptyDescription: 'ستظهر الأرقام هنا عندما يسجّل أول عضو.',
  stats: {
    members: 'الأعضاء',
    membersCaption: (verified: string, suspended: string) =>
      `${verified} موثّق · ${suspended} موقوف`,
    activeServices: 'الخدمات النشطة',
    activeMembers30d: 'أعضاء نشطون',
    activeMembers30dCaption: 'لديهم حجز خلال آخر 30 يوماً',
    pointsInCirculation: 'النقاط المتداولة',
    pointsInCirculationCaption: 'المتاحة + المحجوزة لكل الأعضاء',
    pointsPerActiveMember: 'النقاط لكل عضو نشط',
    pointsPerActiveMemberCaption: 'مؤشر التضخم',
  },
  bookings: {
    title: 'الحجوزات حسب الحالة',
    subtitle: (total: string) => `الإجمالي ${total}`,
    seriesLabel: 'عدد الحجوزات',
  },
  members: {
    title: 'توثيق الأعضاء',
    verified: 'موثّق',
    unverified: 'غير موثّق',
  },
  attention: {
    title: 'بحاجة لانتباهك',
    openDisputes: 'نزاعات مفتوحة',
    pendingSuggestions: 'اقتراحات تصنيفات معلّقة',
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
