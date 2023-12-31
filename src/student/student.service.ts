import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Status, Student } from './entities/student.entity';
import { Model } from 'mongoose';
import { Subject } from 'src/subject/entities/subject.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const candidate = await this.studentModel.findOne({
      email: createStudentDto.email,
    });

    if (candidate) {
      throw new BadRequestException(
        'Заявка уже подана. Студент с такой почтой уже существует',
      );
    }

    const subjectForStudent = [];
    for (const subject of createStudentDto.subjects) {
      const subjectCandidate = await this.subjectModel.findOne({
        title: subject,
      });
      subjectForStudent.push(subjectCandidate);
    }

    const newStudent = new this.studentModel({
      email: createStudentDto.email,
      phone: createStudentDto.phone,
      first_name: createStudentDto.first_name,
      last_name: createStudentDto.last_name,
      status: Status.new,
      study_from: createStudentDto.study_from,
      patronimic: createStudentDto.patronimic,
      uuid: uuidv4(),
      subjects: subjectForStudent,
    });

    return await newStudent.save();
  }

  async findAll() {
    return await this.studentModel.find();
  }

  async findBySubject(subject: string) {
    return await this.studentModel.find(
      { 
        'subjects.title': subject,
        status: { $ne: 'Новая заявка' } 
      }
    )
  }

  async findOne(id: string) {
    return await this.studentModel.findOne({ _id: id });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const candidate = await this.studentModel.findOne({ _id: id })

    if (!candidate) {
      throw new BadRequestException('Студент не найден')
    }

    const subjectForStudent = [];
    if (updateStudentDto.subjects) {
      for (const subject of updateStudentDto.subjects) {
        const subjectCandidate = await this.subjectModel.findOne({
          title: subject,
        });
        subjectForStudent.push(subjectCandidate);
      }
    }

    if (subjectForStudent.length) {
      const updatedStudent = {...updateStudentDto, subjects: subjectForStudent}

      await this.studentModel.updateOne({ _id: id }, updatedStudent);
    } else {
      await this.studentModel.updateOne({ _id: id }, updateStudentDto);
    }

    
    return await this.studentModel.findOne({ _id: id })
  }

  async remove(id: string) {
    await this.studentModel.updateOne(
      { uuid: id },
      {
        status: Status.deleted,
      },
    );

    return {
      message: 'success delete',
    };
  }
}
