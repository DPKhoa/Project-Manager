import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('grade')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => User, (user) => user.grades)
  users: User;

  @ManyToOne(() => Student, (student) => student.grades)
  students: Student;
}
