import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MAGIC_WORDS } from './constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MAGIC_WORDS.HOST,
      port: MAGIC_WORDS.PORT,
      username: MAGIC_WORDS.USERNAME,
      password: MAGIC_WORDS.PASSWORD,
      database: MAGIC_WORDS.DB_NAME,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: true, //! Não usar em prod
    }),
  ],
})
export class DatabseModule {}
