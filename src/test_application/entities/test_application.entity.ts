import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";

@Entity('tests_applications')
export class TestApplication {

    @PrimaryGeneratedColumn()
    id: string;

    @Column('uuid')
    test_id: string;

    @Column('int4')
    typescore_id: number;


}