import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tests_applications')
export class TestApplication {

    @PrimaryGeneratedColumn()
    id: string;

    @Column('uuid')
    test_id: string;

    @Column('int4')
    typescore_id: number;

}