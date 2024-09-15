import { Module } from '@nestjs/common';
import { BatidasModule } from './domain/batidas/batidas.module';

@Module({
  imports: [BatidasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
