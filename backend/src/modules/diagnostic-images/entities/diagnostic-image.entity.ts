import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('imagenes')
export class DiagnosticImage {

  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  name!: string

  @Column({name: 'folio'})
  folio!: string

  @Column({type: "text"})
  diagnostico!: string;

}
