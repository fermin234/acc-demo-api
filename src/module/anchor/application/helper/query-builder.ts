import convertToSnakeCase from './convert-to-snake-case';
import PayloadBuilder from './payload-builder';

export default function queryBuilder(request: Record<string, any>): string {
  const filteredRequest = new PayloadBuilder(request)
    .filterUndefinedValues()
    .build();

  return Object.entries(filteredRequest)
    .map(
      ([key, value]) =>
        `${convertToSnakeCase(key)}=${encodeURIComponent(value as string)}`,
    )
    .join('&');
}
