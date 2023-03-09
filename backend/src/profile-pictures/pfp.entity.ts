import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PFPEntity {
	@PrimaryGeneratedColumn() ID:          string
	@Column()                 PictureData: string
}
