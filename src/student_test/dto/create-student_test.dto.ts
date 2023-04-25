import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class CreateStudentTestDto {

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsUUID()
    @IsNotEmpty()
    test_id: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsUUID()
    @IsNotEmpty()
    test_application_id: string;

    @ApiProperty({
        type: Date,
        description: 'This is a required property',
    })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    started_at: Date;

    @ApiProperty({
        type: Date,
        description: 'This is a required property',
    })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    ended_at: Date;

    @ApiProperty({
        type: [String],
        description: 'This is a required property',
    })
    @IsArray()
    @IsNotEmpty()
    responses: string

}