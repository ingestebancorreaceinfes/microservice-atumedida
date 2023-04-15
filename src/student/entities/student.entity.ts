import { Type } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('students')
export class Student {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('varchar')
    lastname: string;

    @Column('int4')
    grade_id: number;

    @Column('varchar', { unique: true })
    email: string;

    @Column('uuid',{ unique: true })
    user_uuid: string;

    @Column('int4')
    state_id: number;

    @Column('int4')
    city_id: number;

    @Column('int4')
    documentype_id: number;

    @Column('text', { unique: true })
    documentnumber: string;

    @Column('date')
    dateofbirth: Date;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }
}