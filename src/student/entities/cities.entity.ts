import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { States } from "./states.entity";

@Entity('cities')
export class Cities {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    state_id: number;

    @ManyToOne(type => States, state => state.cities)
    @JoinColumn({ name: 'state_id' }) //referencia de la columna
    state: States;

}