import { Injectable } from '@nestjs/common';

@Injectable()
export class TestDbService {
  findAll() {
    return `This action returns all testDb`;
  }
}
