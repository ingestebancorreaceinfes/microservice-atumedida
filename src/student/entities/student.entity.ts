import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('students')
export class Student {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    documentnumber: string;
    
}