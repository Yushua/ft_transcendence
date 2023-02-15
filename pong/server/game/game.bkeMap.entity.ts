import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SimpleColumnType } from "./utils/ColumnTypes"
@Entity()
export class GameBkeMap {
    @PrimaryGeneratedColumn()
    id: string

	@Column("int", { array: true })
	map: number[];

}

