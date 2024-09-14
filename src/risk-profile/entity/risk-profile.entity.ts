import { Injectable } from "@nestjs/common";
import { AfterInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Enterprise } from "src/enterprise/entity/enterprise.entity";
import { Users } from "src/users/entity/users.entity";

@Entity()
export class RiskProfile {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({
        nullable: true,
        unique: true
    })
    course?: string

    @Column({
        nullable: true,
    })
    tuition_check?: number

    @Column({
        type: "boolean"
    })
    living_expense_check: boolean

    @Column({
        type: "boolean"
    })
    balance_overview: boolean

    @Column({
        type: "boolean"
    })
    balance_forcast: boolean

    @Column({
        type: "boolean"
    })

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    probability_of_default: boolean

    @Column({
        type: "boolean"
    })
    account_history: boolean

    @Column({
        type: "date"
    })
    academic_year: Date

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.risk_profile)
    enterprise: Enterprise

    @ManyToOne(() => Users, (user) => user.riskProfile)
    user: Users

    @Column({
        nullable: true
    })
    pdfLink?: string
}


@Entity()
export class RiskProfileProject {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    project_name: string

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => RiskProfile)
    @JoinColumn()
    riskProfile: RiskProfile
}