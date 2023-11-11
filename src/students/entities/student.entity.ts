import { Grade } from "src/grade/entities/grade.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  saintName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'double' })
  startTime: number;

  @Column({ type: 'double' })
  endTime: number;

  @Column({ type: 'double' })
  attendance: number;

  @OneToMany(() => Grade, (grade) => grade.students)
  grades: Grade[];
}
