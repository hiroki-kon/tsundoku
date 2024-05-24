export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export const isUuidType = (uuid: string): uuid is UUID => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
    uuid
  );
};
