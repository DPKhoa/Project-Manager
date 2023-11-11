import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Grade } from 'src/grade/entities/grade.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}
  async create(body: {
    lastName: string;
    role: boolean;
    userName: string;
    passWord: string;
    phone: string;
  }): Promise<User> {
    const salt = await bcrypt.genSalt();

    const lastName: string = body.lastName;
    const role: boolean = body.role;
    const userName: string = body.userName;
    const hashedPassword: string = await bcrypt.hash(body.passWord, salt);
    const phone: string = body.phone;

    const user = new User();
    user.lastName = body.lastName;
    user.role = body.role;
    user.userName = body.userName;
    user.passWord = hashedPassword;
    user.phone = body.phone;

    await this.usersRepository.save(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['grades'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneById(id);
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    // Update user properties
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    await this.usersRepository.remove(user);
  }

  async assignGrade(userId: number, gradeId: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.grades', 'grade')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!isNaN(gradeId) && isFinite(gradeId)) {
      const gradeToAssign = await this.gradeRepository.findOneById(+gradeId);
      if (gradeToAssign) {
        user.grades.push(gradeToAssign);
      } else {
        throw new NotFoundException('Grade not found');
      }
    } else {
      throw new BadRequestException('Invalid gradeId');
    }

    await this.usersRepository.save(user);
    return user;
  }

  async findByClass(gradeId: number): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.grades', 'grade')
      .where('grade.id = :gradeId', { gradeId })
      .getMany();
  }
}
