import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { MovieModule } from './modules/movies/movies.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewModule } from './modules/reviews/review.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'star_cinema',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule, 
    MovieModule,
    FavoritesModule,
    ReviewModule,
    RecommendationsModule
  ],
})
export class AppModule {}
