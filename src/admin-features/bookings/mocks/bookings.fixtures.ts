import {
  UserSummarySchema,
  type AdminBookingDetails,
  type AdminPerson,
  type BookingEvent,
  type BookingStatus,
  type ServiceType,
} from '../schemas/booking.schema';

/** Fake bookings for MSW only. Dates are relative to page load. */

const HOUR = 3_600_000;
const ago = (hours: number) => new Date(Date.now() - hours * HOUR).toISOString();
const uuid = (prefix: string, n: number) =>
  `${prefix}-0000-4000-8000-${String(n).padStart(12, '0')}`;

/** Same ids as the members mocks, so `?userId=` from a member page finds their bookings. */
const memberId = (n: number) =>
  n === 0 ? '3f6c2a9e-8b1d-4c7a-9e2f-1a2b3c4d5e6f' : uuid('5e000000', n);

const people: AdminPerson[] = (
  [
    [0, 'Samer Haddad', 'member@skillloop.test'],
    [1, 'رنا الخطيب', 'rana@example.com'],
    [3, 'Lina Saleh', 'lina@example.com'],
    [6, 'هبة قاسم', 'heba@example.com'],
    [9, 'سارة منصور', 'sara.m@example.com'],
    [12, 'ماجد عودة', 'majed@example.com'],
    [13, 'Tala Haddad', 'tala@example.com'],
    [19, 'Kareem Aziz', 'kareem@example.com'],
    [21, 'Fadi Rashed', 'fadi@example.com'],
  ] as const
).map(([n, fullName, email]) => ({
  id: memberId(n),
  fullName,
  photoUrl: null,
  ratingAvg: 4 + (n % 10) / 10,
  ratingCount: 3 + n,
  email,
  phone: n % 2 ? null : `+9627900${String(n).padStart(5, '0')}`,
}));

const services: [title: string, type: ServiceType, points: number][] = [
  ['ترجمة تقنية EN → AR', 'DELIVERABLE', 120],
  ['IELTS speaking practice', 'SESSION', 25],
  ['تصميم هوية بصرية', 'DELIVERABLE', 300],
  ['دروس رياضيات', 'SESSION', 80],
  ['تصوير منتجات', 'DELIVERABLE', 180],
  ['React code review', 'SESSION', 60],
  ['تعليم عزف عود', 'SESSION', 160],
  ['برمجة إضافة متجر', 'DELIVERABLE', 250],
];

const DONE: BookingStatus[] = ['ACCEPTED', 'DELIVERED'];

/** Statuses each booking went through after PENDING (the last one is its current status). */
const PATHS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [],
  ACCEPTED: ['ACCEPTED'],
  DECLINED: ['DECLINED'],
  CANCELLED: ['CANCELLED'],
  DELIVERED: DONE,
  COMPLETED: [...DONE, 'COMPLETED'],
  DISPUTED: [...DONE, 'DISPUTED'],
  RESOLVED: [...DONE, 'DISPUTED', 'RESOLVED'],
};

/** Event `action` for a status change (the contract's action names). */
const ACTION: Partial<Record<BookingStatus, string>> = { COMPLETED: 'CONFIRMED' };
const BY_PROVIDER = new Set<BookingStatus>(['ACCEPTED', 'DECLINED', 'DELIVERED']);

const CYCLE =
  'DISPUTED PENDING ACCEPTED DELIVERED COMPLETED COMPLETED CANCELLED DECLINED RESOLVED COMPLETED PENDING DELIVERED'.split(
    ' ',
  ) as BookingStatus[];

function buildBooking(n: number): AdminBookingDetails {
  const status = CYCLE[n % CYCLE.length];
  const [serviceTitle, serviceType, pricePoints] = services[n % services.length];
  const receiver = people[n % people.length];
  const provider = people[(n + 3) % people.length];
  const createdHours = 6 + n * 9;
  const path = PATHS[status];
  const at = (status: BookingStatus) => {
    const i = path.indexOf(status);
    return i === -1 ? null : ago(createdHours - (i + 1) * 4);
  };
  const events = (['PENDING', ...path] as BookingStatus[]).map((toStatus, i): BookingEvent => {
    const actorRole =
      toStatus === 'RESOLVED' ? 'ADMIN' : BY_PROVIDER.has(toStatus) ? 'PROVIDER' : 'RECEIVER';
    const actor = actorRole === 'PROVIDER' ? provider : receiver;
    return {
      id: uuid('be000000', n * 10 + i),
      action: i === 0 ? 'CREATED' : (ACTION[toStatus] ?? toStatus),
      fromStatus: i === 0 ? null : (path[i - 2] ?? 'PENDING'),
      toStatus,
      actorRole,
      actor: actorRole === 'ADMIN' ? null : UserSummarySchema.parse(actor),
      note: null,
      createdAt: ago(createdHours - i * 4),
    };
  });
  const isSession = serviceType === 'SESSION';
  const deliveredAt = at('DELIVERED');

  return {
    id: uuid('b0000000', n + 1),
    code: `B-${8812 - n * 3}`,
    status,
    serviceId: uuid('5f000000', n % services.length),
    serviceTitle,
    serviceType,
    categoryId: uuid('ca000000', n % 3),
    durationMinutes: isSession ? 60 : null,
    deliveryDays: isSession ? null : 3,
    pricePoints,
    note: 'أرجو الالتزام بالموعد المتفق عليه.',
    scheduledAt: isSession ? ago(createdHours - 24) : null,
    dueAt: isSession ? null : ago(createdHours - 72),
    deliveryNote: deliveredAt && 'تم التسليم، الروابط مرفقة.',
    deliveryLinks: deliveredAt ? ['https://example.com/delivery'] : [],
    changeRequestsCount: 0,
    lastChangeRequestNote: null,
    declineReason: status === 'DECLINED' ? 'لا يتوفر وقت هذا الأسبوع.' : null,
    cancelledBy: status === 'CANCELLED' ? 'RECEIVER' : null,
    cancelReason: status === 'CANCELLED' ? 'تغيّرت الخطة.' : null,
    expiresAt: status === 'PENDING' ? ago(createdHours - 48) : null,
    autoCompleteAt: status === 'DELIVERED' ? ago(-72) : null,
    acceptedAt: at('ACCEPTED'),
    deliveredAt,
    completedAt: at('COMPLETED'),
    cancelledAt: at('CANCELLED'),
    createdAt: events[0].createdAt,
    updatedAt: events[events.length - 1].createdAt,
    receiver,
    provider,
    disputeId: path.includes('DISPUTED') ? uuid('d0000000', n) : null,
    events,
  };
}

export const bookingFixtures: AdminBookingDetails[] = Array.from({ length: 34 }, (_, n) =>
  buildBooking(n),
);
