import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  mail: string;

  @Column()
  hashedPassword: string;

  @Column({
    default:
      'https://variacion-canasta-zips.s3.sa-east-1.amazonaws.com/default-profile-picture.jpg',
  })
  profilePictureUrl: string;
}
