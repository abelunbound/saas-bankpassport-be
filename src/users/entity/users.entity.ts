import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Enterprise } from 'src/enterprise/entity/enterprise.entity';
import { RiskProfile } from 'src/risk-profile/entity/risk-profile.entity';

@Entity()
export class Users {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({
        nullable: true
    })
    bvn: string;

    @Column()
    email: string;

    @Column({
        nullable: true
    })
    mono_id: string

    @Column()
    type: string

    @Column({
        nullable: true,
        type: "json"
    })
    account: {
        income: {},
        identity: {},
        details: {},
        balance: {},
        expense: {},
        risk_insight: {},
        one_time_payments: {},
        risk_decisioning: {},
        account_check: {},
        transactions: []
    }

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.users, {eager: true})
    @JoinColumn()
    enterprise: Enterprise
    
    // @Column({
    //     nullable: true
    // })
    // enterpriseId: number

    @Column({
        nullable: true,
        type: "json"
    })
    transactions: Array<any>

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RiskProfile, (profile) => profile.user)
    @JoinColumn()
    riskProfile: RiskProfile[]

    @Column({
        nullable: true
    })
    pdfLink?: string

    @Column({
        nullable: true
    })
    expirationToken?: string
}


export enum AccountTypes {
    EUROPE = "EUROPE",
    NIGERIA = "NIGERIA",
}