import { Module } from '@nestjs/common';
import { TestDbService } from './test-db.service';
import { TestDbController } from './test-db.controller';

@Module({
  controllers: [TestDbController],
  providers: [TestDbService],
})
export class TestDbModule {}
