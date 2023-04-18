import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNumber()
    @IsOptional()
    grade_id: number;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNumber()
    @IsNotEmpty()
    state_id: number;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNumber()
    @IsNotEmpty()
    city_id: number;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNumber()
    @IsNotEmpty()
    documentype_id: number;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsString()
    @IsNotEmpty()
    documentnumber: string;

    @ApiPropertyOptional({
        type: Date,
        description: 'This is an optional property',
    })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    dateofbirth: Date;

    @ApiPropertyOptional({
        type: String,
        description: 'This is an optional property',
    })
    @IsOptional()
    schoolname: string;
}