import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Enterprise } from "src/enterprise/entity/enterprise.entity";

export enum COLLABORATOR_PERMISION {
    CREATE_PROFILE = "CREATE_PROFILE",
    READ_PROFILE = "READ_PROFILE",
    CREATE_COLLABORATOR = "CREATE_COLLABORATOR",
    READ_COLLBORATOR = "READ_COLLBORATOR",
    CREATE_PROJECT = "CREATE_PROJECT",
    READ_PROJECT = "READ_PROJECT",
}

@Entity()
export class Collaborator {
    @PrimaryGeneratedColumn("increment")
    id: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column({
        unique: true
    })
    email: string

    @Column()
    user_type: string

    @ManyToOne(() => Enterprise, (user) => user.collaborators)
    enterprise: Enterprise

    @Column({
        type: "json"
    })
    permission: []

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    password: string

    @Column({
        nullable: true
    })
    _password: string
}