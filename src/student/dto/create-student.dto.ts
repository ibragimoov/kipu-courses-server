import { Subject } from 'src/subject/entities/subject.entity';

export class CreateStudentDto {
  readonly first_name: string;
  readonly last_name: string;
  readonly patronimic: string;

  readonly email: string;
  readonly phone: string;

  readonly status: string;

  readonly subjects: string[];
  readonly study_from: string;
}
