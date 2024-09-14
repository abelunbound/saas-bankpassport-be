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

    @Column()
    phone_number: string;

    @OneToMany(() => Users, (user) => user.enterprise, { onUpdate: "CASCADE", onDelete: 'CASCADE' })
    @JoinTable()
    users: Users[]

    @OneToMany(() => Collaborator, (enterprise) => enterprise.enterprise)
    collaborators: Collaborator[]

    @OneToMany(() => RiskProfile, (enterprise) => enterprise.enterprise)
    risk_profile: RiskProfile[]

    @Column()
    enterprise_name: string

    @Column()
    group_email: string

    @Column()
    personal_email: string

    @Column()
    address_line_1: string

    @Column()
    address_line_2: string

    @Column()
    address_line_3: string

    @Column()
    city: string

    @Column()
    postcode: string

    @Column()
    country: string
}