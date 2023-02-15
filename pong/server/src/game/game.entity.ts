import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
		unique: true
	})
	gameType: string

    @Column({
        unique: true
    })
    user1: string
    user1Status: string

    @Column({
		unique: true
	})
	user2: string
    user2Status: string

    @Column({
		unique: true
	})
	gameName: string

}
