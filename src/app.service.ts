import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { stringToHex } from './shared/helpers';
import { Permission } from './permission/entities/permission.entity';
import { PermissionService } from './permission/permission.service';
import { DataSource } from 'typeorm';
import { PermissionValue } from './shared/permission.object';
import { Constant } from './constant/entities/constant.entity';
import { ConstantService } from './constant/constant.service';

@Injectable()
export class AppService {
  private globalPermissions: Permission[];
  private globalConstants: Constant[];

  constructor(
    private readonly dataSource: DataSource,
    private readonly permissionService: PermissionService,
    @Inject(forwardRef(() => ConstantService))
    private readonly constantService: ConstantService,
  ) {}

  // public sendSMS(
  //   message: string,
  //   GSMs: string,
  //   options?: { autofillCode?: string; useOTPWebHook?: boolean },
  // ) {
  //   const { autofillCode, useOTPWebHook } = options || {};

  //   if (process.env.NODE_ENV === "production") {
  //     if (useOTPWebHook)
  //       axios.post(
  //         `${process.env.AUTH_MTN_SMS_WEBHOOK}/send-sms`,
  //         {
  //           text: stringToHex(
  //             (autofillCode ? "# " : "") +
  //               message +
  //               (autofillCode ? "  " + autofillCode : ""),
  //           ),
  //           GSMs: GSMs,
  //           sender: process.env.SMS_SENDER,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );
  //     else
  //       axios.get(
  //         `${process.env.SMS_SERVER_URL}?User=${process.env.SMS_USERNAME}&Pass=${
  //           process.env.SMS_PASSWORD
  //         }&From=${process.env.SMS_SENDER}&Gsm=${GSMs}&Msg=${stringToHex(
  //           (autofillCode ? "# " : "") +
  //             message +
  //             (autofillCode ? "  " + autofillCode : ""),
  //         )}&Lang=0`,
  //       );
  //   }
  // }

  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
    } finally {
      await queryRunner.release();

      await this.setGlobalConstants();
      await this.permissionService.syncPermissions();
      await this.setGlobalPermissions();
    }
  }

  public async setGlobalConstants() {
    this.globalConstants = await this.constantService.findAll();
    console.log(this.globalConstants);
  }

  public async setGlobalPermissions() {
    const result = await this.permissionService.findAll({
      pagination: { limit: 10000, page: 1 },
    });

    this.globalPermissions = result.items;

    console.log(this.globalPermissions);
  }
}
