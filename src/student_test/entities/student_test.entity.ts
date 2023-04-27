import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('students_tests')
export class StudentTest {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    student_id: string;

    @Column('uuid')
    test_id: string;

    @Column('uuid')
    test_application_id: string;

    @Column('timestamp')
    started_at: Date;

    @Column('timestamp')
    ended_at: Date;

    @Column('float')
    total_score: number;

    @Column('text')
    responses: string;

}