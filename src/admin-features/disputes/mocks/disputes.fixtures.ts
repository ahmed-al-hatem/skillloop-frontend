import type {
  AdminDispute,
  AdminPerson,
  BookingEvent,
  BookingStatus,
  DisputeDecision,
  DisputeReason,
  UserSummary,
} from '../schemas/dispute.schema';

/** Fake disputes for MSW only. Dates are relative to page load so the 48h window stays live. */

const HOUR = 3_600_000;
const ago = (hours: number) => new Date(Date.now() - hours * HOUR).toISOString();
const uuid = (group: number, n: number) =>
  `${String(group).padStart(8, '0')}-0000-4000-8000-${String(n).padStart(12, '0')}`;

const person = (n: number, fullName: string, phone: string | null): AdminPerson => ({
  id: uuid(1, n),
  fullName,
  photoUrl: null,
  ratingAvg: 4 + (n % 10) / 10,
  ratingCount: 5 + n * 3,
  email: `member${n}@example.com`,
  phone,
  disputesCount: n % 3,
});

const people = [
  person(1, 'ريم خليل', '+962781112233'),
  person(2, 'Omar Haddad', '+962791234567'),
  person(3, 'سارة العلي', null),
  person(4, 'Yousef Nasser', '+962771239876'),
  person(5, 'لينا منصور', '+962781009988'),
  person(6, 'Khaled Saleh', null),
];

const toSummary = ({ id, fullName, photoUrl, ratingAvg, ratingCount }: AdminPerson) => ({
  id,
  fullName,
  photoUrl,
  ratingAvg,
  ratingCount,
});

export const mockAdmin: UserSummary = {
  id: uuid(1, 99),
  fullName: 'مشرف SkillLoop',
  photoUrl: null,
  ratingAvg: 0,
  ratingCount: 0,
};

type Seed = {
  n: number;
  receiver: number;
  provider: number;
  service: string;
  type: 'SESSION' | 'DELIVERABLE';
  points: number;
  reason: DisputeReason;
  description: string;
  openedHoursAgo: number;
  response?: string;
  resolved?: { decision: DisputeDecision; percent: number; note: string };
};

function buildDispute(s: Seed): AdminDispute {
  const receiver = people[s.receiver];
  const provider = people[s.provider];
  const bookingId = uuid(2, s.n);
  const openedAt = ago(s.openedHoursAgo);
  const respondedAt = s.response ? ago(s.openedHoursAgo - 6) : null;
  const resolvedAt = s.resolved ? ago(s.openedHoursAgo - 50) : null;
  const status = s.resolved ? 'RESOLVED' : 'OPEN';
  const event = (
    i: number,
    action: string,
    fromStatus: BookingStatus | null,
    toStatus: BookingStatus,
    actorRole: BookingEvent['actorRole'],
    actor: AdminPerson,
    hoursBeforeDispute: number,
  ): BookingEvent => ({
    id: uuid(6, s.n * 10 + i),
    action,
    fromStatus,
    toStatus,
    actorRole,
    actor: toSummary(actor),
    note: null,
    createdAt: ago(s.openedHoursAgo + hoursBeforeDispute),
  });

  return {
    id: uuid(3, s.n),
    bookingId,
    status,
    reason: s.reason,
    description: s.description,
    receiverImages: [`https://picsum.photos/seed/d${s.n}a/800/600`],
    providerResponse: s.response ?? null,
    providerImages: s.response ? [`https://picsum.photos/seed/d${s.n}b/800/600`] : [],
    providerRespondedAt: respondedAt,
    decision: s.resolved?.decision ?? null,
    receiverPercent: s.resolved?.percent ?? null,
    adminNote: s.resolved?.note ?? null,
    resolvedAt,
    createdAt: openedAt,
    receiver,
    provider,
    booking: {
      id: bookingId,
      status: s.resolved ? 'RESOLVED' : 'DISPUTED',
      serviceId: uuid(4, s.n),
      serviceTitle: s.service,
      serviceType: s.type,
      categoryId: uuid(5, s.n % 3),
      durationMinutes: s.type === 'SESSION' ? 60 : null,
      deliveryDays: s.type === 'DELIVERABLE' ? 3 : null,
      pricePoints: s.points,
      note: 'أرجو الالتزام بالموعد المتفق عليه.',
      scheduledAt: s.type === 'SESSION' ? ago(s.openedHoursAgo + 24) : null,
      dueAt: s.type === 'DELIVERABLE' ? ago(s.openedHoursAgo + 24) : null,
      deliveryNote: 'تم التسليم.',
      deliveryLinks: [],
      changeRequestsCount: 0,
      lastChangeRequestNote: null,
      declineReason: null,
      cancelledBy: null,
      cancelReason: null,
      expiresAt: null,
      autoCompleteAt: null,
      acceptedAt: ago(s.openedHoursAgo + 72),
      deliveredAt: ago(s.openedHoursAgo + 12),
      completedAt: null,
      cancelledAt: null,
      createdAt: ago(s.openedHoursAgo + 96),
      updatedAt: resolvedAt ?? openedAt,
    },
    events: [
      event(1, 'CREATED', null, 'PENDING', 'RECEIVER', receiver, 96),
      event(2, 'ACCEPTED', 'PENDING', 'ACCEPTED', 'PROVIDER', provider, 72),
      event(3, 'DELIVERED', 'ACCEPTED', 'DELIVERED', 'PROVIDER', provider, 12),
      event(4, 'DISPUTED', 'DELIVERED', 'DISPUTED', 'RECEIVER', receiver, 0),
    ],
    resolvedBy: s.resolved ? mockAdmin : null,
    code: `D-${1040 + s.n}`,
    category: { id: uuid(5, s.n % 3), name: ['لغات', 'برمجة', 'تصميم'][s.n % 3] },
    providerResponseDueAt: new Date(Date.parse(openedAt) + 48 * HOUR).toISOString(),
    canResolve: !s.resolved && (Boolean(s.response) || s.openedHoursAgo >= 48),
  };
}

const seeds: Seed[] = [
  {
    n: 1,
    receiver: 0,
    provider: 1,
    service: 'IELTS speaking practice',
    type: 'SESSION',
    points: 25,
    reason: 'PROVIDER_NO_SHOW',
    description: 'لم ينضم مقدّم الخدمة إلى مكالمة Zoom في الموعد المتفق عليه.',
    openedHoursAgo: 70,
  },
  {
    n: 2,
    receiver: 2,
    provider: 3,
    service: 'تصميم شعار لمشروع ناشئ',
    type: 'DELIVERABLE',
    points: 40,
    reason: 'NOT_AS_DESCRIBED',
    description: 'الشعار المسلَّم لا يطابق الوصف المتفق عليه في الطلب.',
    openedHoursAgo: 30,
    response: 'سلّمت ثلاث نسخ حسب الوصف، والصور مرفقة.',
  },
  {
    n: 3,
    receiver: 4,
    provider: 5,
    service: 'React code review',
    type: 'SESSION',
    points: 30,
    reason: 'POOR_QUALITY',
    description: 'The session ended after 30 of 60 minutes without reviewing the code.',
    openedHoursAgo: 10,
  },
  {
    n: 4,
    receiver: 1,
    provider: 2,
    service: 'ترجمة سيرة ذاتية',
    type: 'DELIVERABLE',
    points: 15,
    reason: 'NOT_DELIVERED',
    description: 'مرّ الموعد النهائي ولم يصل أي ملف.',
    openedHoursAgo: 5,
  },
  {
    n: 5,
    receiver: 3,
    provider: 0,
    service: 'Excel dashboards',
    type: 'SESSION',
    points: 20,
    reason: 'OTHER',
    description: 'تم تغيير موعد الجلسة دون إشعار مسبق.',
    openedHoursAgo: 120,
    response: 'أرسلت إشعاراً قبل يوم كامل.',
    resolved: {
      decision: 'SPLIT',
      percent: 50,
      note: 'انتهت الجلسة بعد نصف المدة، لذلك تم تقسيم النقاط مناصفة.',
    },
  },
  {
    n: 6,
    receiver: 5,
    provider: 4,
    service: 'Arabic calligraphy basics',
    type: 'SESSION',
    points: 35,
    reason: 'PROVIDER_NO_SHOW',
    description: 'Provider did not show up and did not reply to messages.',
    openedHoursAgo: 200,
    resolved: {
      decision: 'REFUND_RECEIVER',
      percent: 100,
      note: 'لم يرد مقدّم الخدمة خلال 48 ساعة، فتمت إعادة النقاط كاملة.',
    },
  },
];

export const disputeFixtures: AdminDispute[] = seeds.map(buildDispute);
