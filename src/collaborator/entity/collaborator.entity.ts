import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Enterprise } from "src/enterprise/entity/enterprise.entity";

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

    @ManyToOne(() => Enterprise, (user) => user.collaborators)
    enterprise: Enterprise
}