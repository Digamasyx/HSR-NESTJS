import { Char } from 'src/char/entity/char.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Files {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageType: string;

  @Column()
  fileName: string;

  @Column({ length: 256 })
  filePath: string;

  @ManyToOne(() => Char, (char) => char.files)
  char: Char;
}
