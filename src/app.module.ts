import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { BatidasModule } from './domain/batidas/batidas.module';
import { TimeSheetsModule } from './domain/time-sheets/timesheets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BatidasModule,
    TimeSheetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
