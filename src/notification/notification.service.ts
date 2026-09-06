import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThanOrEqual,
  Repository,
} from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import {
  awaitForTime,
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
  metaTransformer,
  safeJsonMultiLangParse,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { stringSchema } from 'src/shared/types/zod-schemas';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { FindAllNotificationInput } from './dto/find-all-notification.input';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private fcmAdmin: Messaging;
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private readonly userService: UserService,
  ) {
    // if (getApps().length === 0) {
    //   initializeApp({
    //     credential: cert(
    //       require(`${process.cwd()}/${process.env.FCM_CONFIG_PATH}`),
    //     ),
    //   });
    // }
    // this.fcmAdmin = getMessaging();
  }
  public create(createNotificationInput: CreateNotificationInput) {
    const notification = this.notificationRepository.create(
      createNotificationInput,
    );
    return this.notificationRepository.save(notification);
  }

  public findAll(filter: FindAllNotificationInput) {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .leftJoinAndSelect('notification.broker', 'broker')
      .leftJoinAndSelect('notification.employee', 'employee')
      .where('true');

    generateQuerySorts<Notification>(
      query,
      filter,
      Notification,
      'notification',
    );
    generateQueryConditions<Notification>(query, filter, 'notification');

    return customPaginate<Notification, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    notificationOptions: FindOptionsWhere<Notification>,
    options?: {
      selected?: FindOptionsSelect<Notification>;
      relations?: FindOptionsRelations<Notification>;
    },
  ) {
    return this.notificationRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: notificationOptions,
    });
  }

  public async update(updateNotificationInput: UpdateNotificationInput) {
    await this.notificationRepository.update(
      { id: updateNotificationInput.id },
      updateNotificationInput,
    );
    return this.findOne({ id: updateNotificationInput.id });
  }

  public remove(id: string) {
    this.notificationRepository.delete(id);
  }

  public async sendToUserCriteria(data: CreateNotificationInput) {
    const limit = 100;

    for (const lang of ['ar', 'en']) {
      let page = 1;
      let lastEl = false;

      while (!lastEl) {
        try {
          const users = await this.userService.findAll({
            city_id: { value: data.filter_data?.city?.id! },
            lang: { value: lang, op: 'full' },
            pagination: { page, limit },
          });
          console.log(users);
          const tokens = users.items
            .filter(
              (user): user is User & { fcm_token: string } =>
                typeof user.fcm_token === 'string',
            )
            .map((user) => user.fcm_token);

          if (tokens.length > 0) {
            try {
              await this.fcmAdmin.sendEach(
                tokens.map((token) => ({
                  token,
                  data: {
                    title: safeJsonMultiLangParse(data.title)[lang],
                    body: safeJsonMultiLangParse(data.body)[lang],
                  },
                })),
              );
            } catch (error) {
              console.log(error);
            }
          }

          page++;

          if (users.items.length < limit) lastEl = true;

          await awaitForTime(20 * 1000);
        } catch (error) {
          console.log(error);
          lastEl = true;
        }
      }
    }

    console.log('Done sending notifications.....');
  }

  public async sendNotificationToUser(data: CreateNotificationInput) {
    if (!data) return null;
    let targetService: any;
    let targetId: string | undefined;

    if (stringSchema.safeParse(data.user_id).success) {
      targetService = this.userService;
      targetId = data.user_id;
    }
    if (!targetService || !targetId) {
      console.warn('No valid target to send notification', data);
      return null;
    }
    const notification = await this.create({
      ...data,
      global: false,
      filter_data: {},
    });

    const target = await targetService.findOne(
      { id: targetId },
      { selected: { id: true, lang: true, fcm_token: true } },
    );

    console.log('Target =>', target);

    if (!target) {
      console.warn(`Target with id ${targetId} not found`);
      return notification;
    }

    if (!target.fcm_token) {
      console.warn(`No FCM token for target ${target.id}`);
      return notification;
    }

    await this.sendNotification(
      {
        title: data.title,
        body: data.body,
        img_url: data.img_url ?? '',

        lang: target.lang || 'ar',
        extraData: data.extraData,
      },
      target.fcm_token,
    );

    return notification;
  }

  public async sendNotification(
    data: {
      body: string;
      title: string;
      lang: string;
      img_url: string;
      extraData?: Record<string, string>;
    },
    fcmToken: string,
  ) {
    try {
      const payload = {
        data: {
          title: safeJsonMultiLangParse(data.title)[data.lang],
          body: safeJsonMultiLangParse(data.body)[data.lang],
          image: data.img_url,
          ...(data.extraData ? data.extraData : {}),
        },
        token: fcmToken,
      };

      const response = await this.fcmAdmin.send(payload);

      console.log('FCM  response:', response);
      return response;
    } catch (error) {
      console.error(' Error sending notification:', error);
      return null;
    }
  }
}
