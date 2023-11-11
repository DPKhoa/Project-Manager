import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Grade } from 'src/grade/entities/grade.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Grade])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
