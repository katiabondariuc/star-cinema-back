import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entity/reviews.entity';
import { ReviewService } from './service/review.service';
import { ReviewController } from './controller/review.controller';




@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}