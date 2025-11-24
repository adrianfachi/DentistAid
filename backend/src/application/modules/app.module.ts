import { Module } from '@nestjs/common';
import { PatientModule } from 'src/domain/patient-aggregate/modules/patient.module';
import { PostModule } from 'src/domain/patient-aggregate/modules/post.module';
import { InfrastructureModule } from 'src/infrastructure/modules/infrastructure.module';


@Module({
  imports: [PatientModule, PostModule, InfrastructureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
