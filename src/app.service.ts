import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
      ) {}
      async create(data: any): Promise<User> {
        return this.userRepository.save(data);
      }
      async findOneBy(condition: any): Promise<User> {
        return this.userRepository.findOneBy(condition);
      }
}
