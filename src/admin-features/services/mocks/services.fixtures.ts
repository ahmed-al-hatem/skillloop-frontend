import { z } from 'zod';
import {
  ServiceSchema,
  type Category,
  type Service,
  type ServiceStatus,
  type UserSummary,
} from '../schemas/service.schema';

/** Fake services for MSW. Parsed with the schema below so fixtures never drift from the contract. */

const uuid = (prefix: string, n: number) =>
  `${prefix}-0000-4000-8000-${String(n).padStart(12, '0')}`;

const day = (daysAgo: number) => new Date(Date.UTC(2026, 10, 28 - daysAgo, 9)).toISOString();

const category = (n: number, nameAr: string, nameEn: string, icon: string): Category => ({
  id: uuid('ca000000', n),
  nameAr,
  nameEn,
  icon,
  isOther: false,
  sortOrder: n,
});

const categories = {
  translation: category(1, 'ترجمة', 'Translation', 'languages'),
  design: category(2, 'تصميم', 'Design', 'palette'),
  languages: category(3, 'لغات', 'Languages', 'book'),
  programming: category(4, 'برمجة', 'Programming', 'code'),
  photography: category(5, 'تصوير', 'Photography', 'camera'),
  career: category(6, 'مهني', 'Career', 'briefcase'),
  music: category(7, 'موسيقى', 'Music', 'music'),
};

/** Same ids and names as the members mock, so provider links open a real mock member. */
const provider = (n: number, fullName: string): UserSummary => ({
  id: uuid('5e000000', n),
  fullName,
  photoUrl: null,
  ratingAvg: 4 + (n % 10) / 10,
  ratingCount: 3 + n,
});

/** Members 2 and 7 are SUSPENDED in the members mock: their services are hidden (🟡 `isHidden`). */
const SUSPENDED_PROVIDERS = new Set([2, 7]);

type Seed = [
  title: string,
  category: keyof typeof categories,
  providerIndex: number,
  providerName: string,
  price: number,
  status: ServiceStatus,
];

const seeds: Seed[] = [
  ['ترجمة تقنية EN → AR', 'translation', 1, 'رنا الخطيب', 120, 'ACTIVE'],
  ['تصميم شعار احترافي خلال 24 ساعة', 'design', 3, 'Lina Saleh', 120, 'ACTIVE'],
  ['دروس إنجليزي محادثة', 'languages', 6, 'هبة قاسم', 200, 'ACTIVE'],
  ['إصلاح مواقع ووردبريس', 'programming', 2, 'محمد العلي', 150, 'ACTIVE'],
  ['تصوير منتجات احترافي', 'photography', 13, 'Tala Haddad', 180, 'ACTIVE'],
  ['مراجعة السيرة الذاتية', 'career', 9, 'سارة منصور', 40, 'ACTIVE'],
  ['تعليم عزف العود', 'music', 7, 'يزن حداد', 160, 'PAUSED'],
  ['IELTS speaking practice', 'languages', 19, 'Kareem Aziz', 25, 'ACTIVE'],
  ['تصميم هوية بصرية كاملة', 'design', 3, 'Lina Saleh', 300, 'ARCHIVED'],
  ['تطبيق React من الصفر', 'programming', 10, 'خالد الزعبي', 90, 'ACTIVE'],
  ['ترجمة عقود قانونية', 'translation', 1, 'رنا الخطيب', 140, 'PAUSED'],
  ['تحضير لمقابلة عمل', 'career', 9, 'سارة منصور', 35, 'ACTIVE'],
  ['جلسة تصوير بورتريه', 'photography', 13, 'Tala Haddad', 110, 'ARCHIVED'],
  ['دروس فرنسي للمبتدئين', 'languages', 6, 'هبة قاسم', 60, 'ACTIVE'],
  ['مراجعة كود Python', 'programming', 7, 'يزن حداد', 45, 'ACTIVE'],
  ['تصميم منشورات سوشال ميديا', 'design', 19, 'Kareem Aziz', 70, 'ACTIVE'],
  ['أساسيات نظرية الموسيقى', 'music', 10, 'خالد الزعبي', 30, 'ACTIVE'],
  ['تدقيق لغوي لمقالات', 'translation', 2, 'محمد العلي', 20, 'PAUSED'],
  ['إعداد ملف LinkedIn', 'career', 3, 'Lina Saleh', 50, 'ACTIVE'],
  ['مونتاج فيديو قصير', 'photography', 19, 'Kareem Aziz', 85, 'ACTIVE'],
  ['تعليم Excel المتقدم', 'programming', 9, 'سارة منصور', 55, 'ARCHIVED'],
  ['محادثة عربية لغير الناطقين', 'languages', 1, 'رنا الخطيب', 40, 'ACTIVE'],
];

function service(
  [title, cat, providerIndex, providerName, price, status]: Seed,
  n: number,
): Service {
  const isSession = n % 3 !== 1;
  return {
    id: uuid('5e510000', n + 1),
    title,
    type: isSession ? 'SESSION' : 'DELIVERABLE',
    category: categories[cat],
    customCategoryName: null,
    durationMinutes: isSession ? 60 : null,
    level: isSession ? 'INTERMEDIATE' : null,
    mode: isSession ? 'ONLINE' : null,
    deliveryDays: isSession ? null : 3,
    complexity: isSession ? null : 'MEDIUM',
    pricePoints: price,
    ratingAvg: n % 5 === 4 ? 0 : 4 + (n % 9) / 10,
    ratingCount: n % 5 === 4 ? 0 : 2 + n,
    completedCount: (n * 7) % 40,
    provider: provider(providerIndex, providerName),
    description: `${title}: وصف تجريبي للخدمة يشرح ما سيحصل عليه المستلم بالتفصيل.`,
    status,
    suggestedPoints: price,
    createdAt: day(5 + n * 2),
    updatedAt: day(n),
    bookingsCount: (n * 13) % 70,
    isHidden: SUSPENDED_PROVIDERS.has(providerIndex) && status !== 'ARCHIVED',
  };
}

export const serviceFixtures: Service[] = z.array(ServiceSchema).parse(seeds.map(service));
