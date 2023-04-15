import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStudentDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsNumber()
    @IsNotEmpty()
    grade_id: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    user_uuid: string;

    @IsNumber()
    @IsNotEmpty()
    state_id: number;

    @IsNumber()
    @IsNotEmpty()
    city_id: number;

    @IsNumber()
    @IsNotEmpty()
    documentype_id: number;

    @IsString()
    @IsNotEmpty()
    documentnumber: string;

    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    // @IsNotEmpty()
    dateofbirth: Date;
}