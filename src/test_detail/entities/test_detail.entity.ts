import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tests_details')
export class TestDetail {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    test_id: string;

    @Column('uuid')
    question_id: string;

}