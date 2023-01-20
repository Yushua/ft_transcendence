//autoload in app.module.ts

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
}
