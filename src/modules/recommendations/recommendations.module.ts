import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationEntity } from './entity/recommendations.entity';
import { RecommendationsService } from './service/recommendations.service';
import { RecommendationsController } from './controller/recommendations.controller';


@Module({
  imports: [TypeOrmModule.forFeature([RecommendationEntity])],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}