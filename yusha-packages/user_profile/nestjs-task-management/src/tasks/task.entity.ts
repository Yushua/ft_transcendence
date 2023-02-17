//autoload in app.module.ts

import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.model";

@Entity()
export class Task {
    //auto generated and that ID is the primary column
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    //so in the future, fi you want ot use the fucntions in
    //User, you need to do this.
    @ManyToOne((_type) => User, user => user.tasks, {eager: false})
    @Exclude({ toPlainOnly: true})
    user: User;
}
