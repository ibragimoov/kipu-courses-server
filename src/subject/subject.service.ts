import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from './entities/subject.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) {}

  create(createSubjectDto: CreateSubjectDto) {
    const createdSubject = new this.subjectModel(createSubjectDto);
    return createdSubject.save();
  }

  findAll() {
    return this.subjectModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
