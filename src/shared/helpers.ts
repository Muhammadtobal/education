import {
  getMetadataArgsStorage,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import { diskStorage } from 'multer';
import { DataSource } from 'typeorm';

import {
  InInputSchema,
  ListOfIdsInputSchema,
  MatchInputSchema,
  MaxDateInputSchema,
  MaxNumberInputSchema,
  MinDateInputSchema,
  MinNumberInputSchema,
  RangeDateInputSchema,
  RangeNumberInputSchema,
  SingleDateInputSchema,
  SingleNumberInputSchema,
} from './types/zod-schemas';
import {
  ListOfIdsInput,
  MatchInput,
  MaxDateInput,
  MaxNumberInput,
  MinDateInput,
  MinNumberInput,
  SingleDateInput,
  SingleNumberInput,
} from './types/graphql-input-types';
import { PaginationMetadata } from './types/pagination-metadata';

import { ErrorMessages } from './error-messages.object';

export function generateQuerySorts<T>(
  // @ts-ignore
  query: SelectQueryBuilder<T>,
  filter: any,
  entity: Function,
  entityName: string,
) {
  if (
    filter.sort &&
    isValidColumn(entity, filter.sort.by.split('.')[0]) &&
    ['ASC', 'DESC'].includes(filter.sort.type)
  ) {
    if (
      filter.sort.by.split('.')[0] === 'counts' &&
      filter.sort.by.split('.')[1]
    )
      query.orderBy(
        `JSON_EXTRACT(${entityName}.counts, '$.${filter.sort.by.split('.')[1]}')`,
        `${filter.sort.type}` as 'ASC' | 'DESC',
      );
    else
      query.orderBy(
        `${entityName}.${filter.sort.by}`,
        `${filter.sort.type}` as 'ASC' | 'DESC',
      );
  } else query.orderBy(`${entityName}.id`, `DESC`);
}
export function isValidColumn(entity: Function, columnName: string): boolean {
  const columns = getMetadataArgsStorage()
    .columns.filter((col) => col.target === entity)
    .map((col) => col.propertyName);

  return columns.includes(columnName as string);
}

export function generateQueryConditions<T>(
  // @ts-ignore
  query: SelectQueryBuilder<T>,
  filter: any,
  entityName: string,
) {
  // TODO: SingleIdInputSchema is missed !
  for (const key in filter) {
    if (typeof filter[key] === 'boolean')
      query.andWhere(`${entityName}.${key} = :${key}`, {
        [key]: filter[key],
      });

    if (
      SingleDateInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['value'])
    )
      query.andWhere(`${entityName}.${key} = :${key}`, {
        [key]: (filter[key] as SingleDateInput).value,
      });

    if (
      MinDateInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['min'])
    )
      query.andWhere(`${entityName}.${key} >= :${key}`, {
        [key]: (filter[key] as MinDateInput).min,
      });

    if (
      MaxDateInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['max'])
    )
      query.andWhere(`${entityName}.${key} < :${key}`, {
        [key]: (filter[key] as MaxDateInput).max,
      });

    if (RangeDateInputSchema.safeParse(filter[key]).success)
      query.andWhere(`${entityName}.${key} BETWEEN :min AND :max`, {
        ...filter[key],
      });

    if (
      SingleNumberInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['value'])
    )
      query.andWhere(`${entityName}.${key} = :${key}`, {
        [key]: (filter[key] as SingleNumberInput).value,
      });

    if (
      MinNumberInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['min'])
    )
      query.andWhere(`${entityName}.${key} >= :${key}`, {
        [key]: (filter[key] as MinNumberInput).min,
      });

    if (
      MaxNumberInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['max'])
    )
      query.andWhere(`${entityName}.${key} < :${key}`, {
        [key]: (filter[key] as MaxNumberInput).max,
      });

    if (RangeNumberInputSchema.safeParse(filter[key]).success)
      query.andWhere(`${entityName}.${key} BETWEEN :min AND :max`, {
        ...filter[key],
      });

    if (
      ListOfIdsInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['ids'])
    )
      query.andWhere(`${entityName}.${key} IN (:...${key}s)`, {
        [key + 's']: (filter[key] as ListOfIdsInput).ids,
      });

    if (MatchInputSchema.safeParse(filter[key]).success) {
      if ((filter[key] as MatchInput).op === 'full')
        query.andWhere(`${entityName}.${key} = :${key}`, {
          [key]: (filter[key] as MatchInput).value,
        });
      else
        query.andWhere(`${entityName}.${key} LIKE :${key}`, {
          [key]: `%${(filter[key] as MatchInput).value}%`,
        });
    }

    if (
      InInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['in'])
    )
      query.andWhere(`${entityName}.${key} IN(:...in_values)`, {
        in_values: filter[key]['in'],
      });

    if (key === 'counts') {
      for (const countsKey in filter.counts) {
        const countsValue = filter.counts[countsKey];

        // Single value
        if (
          SingleNumberInputSchema.safeParse(countsValue).success &&
          hasOnlySpecificProperties(countsValue, ['value'])
        ) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') = :value`,
            { value: countsValue.value },
          );
        }

        // Minimum value
        if (
          MinNumberInputSchema.safeParse(countsValue).success &&
          hasOnlySpecificProperties(countsValue, ['min'])
        ) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') >= :min`,
            { min: countsValue.min },
          );
        }

        // Maximum value
        if (
          MaxNumberInputSchema.safeParse(countsValue).success &&
          hasOnlySpecificProperties(countsValue, ['max'])
        ) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') <= :max`,
            { max: countsValue.max },
          );
        }

        // Range (min + max)
        if (RangeNumberInputSchema.safeParse(countsValue).success) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') BETWEEN :min AND :max`,
            { min: countsValue.min, max: countsValue.max },
          );
        }
      }
    }
  }
}

export function hasOnlySpecificProperties(obj, allowedKeys: string[]) {
  const objKeys = Object.keys(obj);

  return (
    objKeys.length === allowedKeys.length &&
    objKeys.every((key) => allowedKeys.includes(key))
  );
}
export const metaTransformer = (meta: IPaginationMeta): PaginationMetadata =>
  new PaginationMetadata(
    meta?.totalItems || 0,
    meta.currentPage,
    meta.itemsPerPage,
    meta?.totalPages || 0,
  );

export function stringToHex(str: string) {
  let codeHex = '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    codeHex = str.charCodeAt(i).toString(16).toUpperCase();
    while (codeHex.length < 4) {
      codeHex = '0' + codeHex;
    }
    result += codeHex;
  }
  return result;
}

export function getEmpId(
  user: { userId: string } | { empId: string } | { teacherId: string },
) {
  if ('empId' in user) return user.empId;

  return '0';
}

export function getUserId(
  user: { userId: string } | { empId: string } | { teacherId: string },
) {
  if ('userId' in user) return user.userId;

  return '0';
}

export function getTeacherId(
  user: { userId: string } | { teacherId: string } | { empId: string },
) {
  if ('teacherId' in user) return user.teacherId;
  return '0';
}

export const safeJsonMultiLangParse = (
  jsonString: string,
): Record<'ar' | 'en', string> => {
  try {
    const result = JSON.parse(jsonString);
    if ('ar' in result && 'en' in result) return result;

    return { ar: '', en: '' };
  } catch (error) {
    return { ar: '', en: '' };
  }
};

export const safeJsonStringify = (
  json: Record<string, any> | string[],
): string => {
  try {
    const result = JSON.stringify(json);
    return result;
  } catch (error) {
    return '';
  }
};

export const awaitForTime = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const multerOptions = {
  storage: diskStorage({
    destination: process.env.DESTINATION,
    filename: (req, file, callback) => {
      const uniqueSuffix =
        Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
      const ext = path.extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowed = ['jpg', 'jpeg', 'png'];
    const ext = path.extname(file.originalname).slice(1).toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(
        new HttpException(
          ErrorMessages.IMAGE_NOT_CORRECT,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    cb(null, true);
  },
};

export async function customPaginate<
  T extends ObjectLiteral,
  M = PaginationMetadata,
>(
  query: SelectQueryBuilder<T>,
  options: {
    limit: number;
    page: number;
  },
): Promise<{ items: T[]; meta: PaginationMetadata }> {
  const { limit, page } = options;
  const offset = (page - 1) * limit;

  let data: T[] = await query.clone().take(limit).skip(offset).getMany();

  const mainAlias = query.expressionMap.mainAlias?.name;
  if (!mainAlias) throw new Error('Main alias not found in query builder');

  const countQuery = query.clone();
  countQuery.expressionMap.skip = undefined;
  countQuery.expressionMap.take = undefined;
  countQuery.expressionMap.orderBys = {};
  const rawCount = await countQuery
    .select(`COUNT(DISTINCT ${mainAlias}.id)`, 'cnt')
    .getRawOne<{ cnt: string }>();
  const totalItems = Number(rawCount?.cnt ?? 0);

  const metaData: IPaginationMeta = {
    itemCount: data.length,
    totalItems,
    itemsPerPage: limit,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
  };

  return {
    items: data,
    meta: metaTransformer(metaData),
  };
}

export function getAllowedFields(
  dataSource: DataSource,
  ...entities: Function[]
): Record<string, Record<string, true>> {
  const result: Record<string, Record<string, true>> = {};

  entities.forEach((entity) => {
    const repo = dataSource.getRepository(entity);
    const allCols = repo.metadata.columns.map((c) => c.propertyName);
    const excludeFields = [
      'password',
      'refresh_token',
      'fcm_token',
      'username',
      'password',
    ];
    const allowedCols = allCols.filter((col) => !excludeFields.includes(col));

    result[repo.metadata.name] = Object.fromEntries(
      allowedCols.map((col) => [col, true]),
    );
  });

  return result;
}
