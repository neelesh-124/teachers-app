import { scheduleEventParam } from '@/utils/Interfaces';
import { post } from './RestClient';

export const getEventList = async ({
  limit,
  offset,
  filters,
}: scheduleEventParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_EVENT_BASE_URL}/list`;
  try {
    const response = await post(apiUrl, { limit, offset, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};
