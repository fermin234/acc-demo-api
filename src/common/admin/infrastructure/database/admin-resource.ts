import { BookSchema } from '@book/infrastructure/database/book.schema';

import { GenreSchema } from '@genre/infrastructure/database/genre.schema';

import { UserSchema } from '@iam/user/infrastructure/database/user.schema';

export const adminSchemas = [BookSchema, GenreSchema, UserSchema];

// https://docs.adminjs.co/basics/resource#customizing-actions
export const adminResources = [
  {
    schema: BookSchema,
  },
  {
    schema: GenreSchema,
  },
  {
    schema: UserSchema,
    options: {
      properties: {
        roles: {
          type: 'string',
          isArray: true,
        },
      },
    },
  },
];
