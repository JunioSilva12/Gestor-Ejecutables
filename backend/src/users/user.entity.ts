import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from '../files/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @OneToMany(() => File, (file) => file.user)
  files!: File[];
}
