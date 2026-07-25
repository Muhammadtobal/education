import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { exec } from 'child_process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('selfDeploy')
  selfDeploy(@Headers('x-gitlab-token') token: string) {
    if (token !== process.env.DEPLOY_SECRET)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    console.log('selfDeploy started');

    new Promise((resolve, reject) => {
      exec(
        `bash ${process.env.DEPLOY_SCRIPT_PATH}`,
        { cwd: `${process.cwd()}` },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            reject({ success: false, error: stderr });
          } else resolve({ success: true, log: stdout });
        },
      );
    });

    return { deployed: true };
  }
}
