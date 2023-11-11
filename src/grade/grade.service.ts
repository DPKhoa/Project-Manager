import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}
  async create(createGradeDto: CreateGradeDto) {
    const grades = this.gradeRepository.create(createGradeDto);
    return await this.gradeRepository.save(grades);
  }

  async  findAll(): Promise<Grade[]> {
    return await this.gradeRepository.find();
  }

  async findOne(id: number) {
    return await this.gradeRepository.findOneById(id);
  }

  async update(id: number, updateGradeDto: Partial<Grade>): Promise<Grade> {
    const grade = await this.gradeRepository.findOneById(id);

    if (!grade) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    // Update user properties
    Object.assign(grade, updateGradeDto);

    return this.gradeRepository.save(grade);
  
  }

  async remove(id: number): Promise<void> {
    const grade = await this.gradeRepository.findOneById(id);

    if (!grade) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    await this.gradeRepository.remove(grade);
  }


  
}
