import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export const isUuidType = (uuid: string): uuid is UUID => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
    uuid
  );
};

dayjs.extend(timezone);
dayjs.extend(utc);

export const getDateTImeWithTImezone = (
  timezone: string = "Asia/Tokyo"
): string => {
  return dayjs().tz(timezone).toISOString();
};
