import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";

@Entity('tests_details')
export class TestDetail {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    test_id: string;

    @Column('uuid')
    question_id: string;
    
    @Column('numeric')
    order: number;

    @Column('numeric')
    area_id: number;

    @Column('numeric')
    subject_id: number;

    @ManyToOne(
        () => Question,
        question => question.testdetails,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
    )
    @JoinColumn([{ name: 'question_id', referencedColumnName: 'id' }])
    questions?: Question;
}