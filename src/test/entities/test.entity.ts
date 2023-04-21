import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tests')
export class Test {

    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    is_active: boolean;

    @Column('int4')
    numberofquestion: number;

}