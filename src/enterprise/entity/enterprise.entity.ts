import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { RiskProfile } from 'src/risk-profile/entity/risk-profile.entity';
import { Collaborator } from 'src/collaborator/entity/collaborator.entity';
import { Users } from 'src/users/entity/users.entity';


@Entity()
export class Enterprise {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({
        unique: true
    })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    phone_number: string;

    @OneToMany(() => Users, (user) => user.enterprise, { onUpdate: "CASCADE", onDelete: 'CASCADE' })
    @JoinTable()
    users: Users[]

    @OneToMany(() => Collaborator, (enterprise) => enterprise.enterprise)
    collaborators: Collaborator[]

    @OneToMany(() => RiskProfile, (enterprise) => enterprise.enterprise)
    risk_profile: RiskProfile[]

    @Column({
        nullable: true
    })
    enterprise_name: string

    @Column({
        nullable: true
    })
    group_email: string

    @Column({
        nullable: true
    })
    personal_email: string

    @Column({
        nullable: true
    })
    address_line_1: string

    @Column({
        nullable: true
    })
    address_line_2: string

    @Column({
        nullable: true
    })
    address_line_3: string

    @Column({
        nullable: true
    })
    city: string

    @Column({
        nullable: true
    })
    postcode: string

    @Column({
        nullable: true
    })
    country: string
}