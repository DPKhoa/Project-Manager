import { Grade } from "src/grade/entities/grade.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    lastName: string;

    @Column({ default: false })
    role: boolean;

    @Column({ length: 100 })
    userName: string;
    
    @Column({ length: 100 })
    passWord: string;

    
    
    @Column({ length: 100 })
    phone: string;

    @OneToMany(() => Grade, (grade) => grade.users)
    grades: Grade[];
}
