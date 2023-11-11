import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from 'src/grade/entities/grade.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentsRepository.create(createStudentDto);
    return await this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentsRepository.find({ relations: ['grades'] });
  }

  async findOne(id: number): Promise<Student | null> {
    return await this.studentsRepository.findOneById(id);
  }

  async update(
    id: number,
    updateStudentDto: Partial<Student>,
  ): Promise<Student> {
    const student = await this.studentsRepository.findOneById(id);

    if (!student) {
      throw new NotFoundException(`student with id ${id} not found.`);
    }

    // Update student properties
    Object.assign(student, updateStudentDto);

    return this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.studentsRepository.findOneById(id);

    if (!student) {
      throw new NotFoundException(`student with id ${id} not found.`);
    }

    await this.studentsRepository.remove(student);
  }

  async assignGrade(studentId: number, gradeId: number): Promise<Student> {
    const student = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.grades', 'grade')
      .where('student.id = :studentId', { studentId })
      .getOne();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (!isNaN(gradeId) && isFinite(gradeId)) {
      const gradeToAssign = await this.gradeRepository.findOneById(+gradeId);
      if (gradeToAssign) {
        student.grades.push(gradeToAssign);
      } else {
        throw new NotFoundException('Grade not found');
      }
    } else {
      throw new BadRequestException('Invalid gradeId');
    }
    await this.studentsRepository.save(student);
    return student;
  }
}
