import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { MovieEntity } from '../../movies/entity/movie.entity';

@Entity('recommendations')
export class RecommendationEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true })
  movie_id: number;

  @Column({ type: 'float', nullable: true })
  score?: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  generated_at: Date;

  // ---------- RELATIONS ----------
  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => MovieEntity, (movie) => movie.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;
}
