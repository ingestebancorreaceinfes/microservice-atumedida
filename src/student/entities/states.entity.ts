import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cities } from "./cities.entity";

@Entity('states')
export class States {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @OneToMany(type => Cities, cities => cities.state)
    cities: Cities[]
}