import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TestApplication } from "../../test_application/entities/test_application.entity";
import { TestDetail } from "../../test_detail/entities/test_detail.entity";

@Entity('questions')
export class Question {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column( {
        type:'varchar'
    })
    answer: string;

    @Column( {
        type:'integer'
    })
    competence_id:number;
    
    @Column( {
        type:'integer'
    })
    component_id:number;

    @Column( {
        type:'integer'
    })
    task_id:number;
    @Column( {
        type:'numeric'
    })
    measure:number;

    @OneToMany(
        () => TestDetail, 
        testDetail => testDetail.questions,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION', cascade:true}
    )
    testdetails?: TestDetail[];
}
