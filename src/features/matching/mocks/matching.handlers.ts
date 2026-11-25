import { delay, http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { suggestions } from './matching.data';

export const matchingHandlers = [
  http.get(`${env.API_URL}/matches/suggestions`, async () => {
    await delay(400);
    return HttpResponse.json({ data: suggestions });
  }),
];
