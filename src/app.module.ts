import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { GraphQLError } from 'graphql';
import { TeacherModule } from './teacher/teacher.module';

import { SubscriptionModule } from './subscription/subscription.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CityModule } from './city/city.module';
import { PermissionModule } from './permission/permission.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeePermissionModule } from './employee_permission/employee_permission.module';
import { LevelModule } from './level/level.module';
import { PlanModule } from './plan/plan.module';
import { CourseModule } from './course/course.module';
import { PlanCourseModule } from './plan_course/plan_course.module';
import { ExamModule } from './exam/exam.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { DiscussionModule } from './discussion/discussion.module';
import { ContentModule } from './content/content.module';
import { NotificationModule } from './notification/notification.module';
import { CouponModule } from './coupon/coupon.module';
import { PlanCouponModule } from './plan_coupon/plan_coupon.module';
import { StoryModule } from './story/story.module';
import { LoginHistoryModule } from './login_history/login_history.module';
import { ConstantModule } from './constant/constant.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PaymentCodeModule } from './payment_code/payment_code.module';
import { BannerModule } from './banner/banner.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      ssl: {
        rejectUnauthorized: false,
      },

      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      debug: process.env.NODE_ENV !== 'production',
      path: process.env.BASE_URL,
      formatError: (formattedError, error) => {
        const graphQLError = error as GraphQLError;
        if (process.env.NODE_ENV === 'production')
          return { message: formattedError.message };
        return {
          message: formattedError.message,
          originalError:
            graphQLError.extensions?.originalError || graphQLError.message,
        };
      },
      plugins:
        process.env.NODE_ENV !== 'production'
          ? [ApolloServerPluginLandingPageLocalDefault()]
          : [],
    }),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    TeacherModule,

    SubscriptionModule,
    ReviewModule,
    PaymentModule,
    AuthModule,
    UserModule,
    CityModule,
    PermissionModule,
    EmployeeModule,
    EmployeePermissionModule,
    LevelModule,
    NotificationModule,

    PlanModule,
    CourseModule,
    PlanCourseModule,
    ExamModule,
    QuestionModule,
    AnswerModule,
    DiscussionModule,
    ContentModule,
    EmployeeModule,
    EmployeePermissionModule,
    PermissionModule,
    CouponModule,
    PlanCouponModule,
    StoryModule,
    LoginHistoryModule,
    ConstantModule,
    PaymentCodeModule,
    BannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
