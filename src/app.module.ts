import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { GradeModule } from './grade/grade.module';
import { Grade } from './grade/entities/grade.entity';
import { GradeService } from './grade/grade.service';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student.entity';
import { StudentsService } from './students/students.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345',
      database: 'dbnest',
      entities: [User, Grade,Student],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    TypeOrmModule.forFeature([User, Grade,Student]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    GradeModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService,GradeService,StudentsService],
})
export class AppModule {}
