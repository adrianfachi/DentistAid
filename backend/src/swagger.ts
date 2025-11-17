import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


export default function initSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('DentistAid API')
        .setDescription('A complete API documentation for the DentistAid application')
        .setVersion('1.0')
        .addTag('DentistAid')
        .build();
    
    const document = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}