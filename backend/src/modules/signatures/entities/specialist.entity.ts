import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('usuarios')
export class SpecialistEntity{
  
  @PrimaryColumn({name: 'usr_codigo'})
  usrCodigo!: string;

  @Column({name: 'nombre_completo'})
  nombreCompleto!: string;

  @Column({name: 'tipodcto_cod'})
  tipodctoCod!: string;

  @Column({name: 'documento'})
  documento!: string

  @Column({name: 'profesion', nullable: true})
  profesion?: string;

  @Column({name: 'firma', type: 'bytea', nullable: true})
  firma?: Buffer;

}