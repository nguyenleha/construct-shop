import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestDbService {
  constructor(private config: ConfigService) {}
  findAll() {
    return `This action returns all testDb`;
  }
}
