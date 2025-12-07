import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entity/movie.entity';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';


@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}