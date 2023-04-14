import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('states')
export class States {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

}