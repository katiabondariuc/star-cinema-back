import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from './entity/favorites.entity';
import { FavoritesService } from './service/favorites.service';
import { FavoritesController } from './controller/favorites.controller';



@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}