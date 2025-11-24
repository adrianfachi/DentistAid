import { Module } from '@nestjs/common';
import { AppointmentModule } from 'src/domain/calender-aggregate/modules/appointment.module';
import { PatientModule } from 'src/domain/patient-aggregate/modules/patient.module';
import { PostModule } from 'src/domain/patient-aggregate/modules/post.module';
import { InfrastructureModule } from 'src/infrastructure/modules/infrastructure.module';


@Module({
  imports: [PatientModule, PostModule, AppointmentModule, InfrastructureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
