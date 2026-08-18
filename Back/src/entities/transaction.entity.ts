import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  reference: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'uuid', nullable: true })
  customerId: string;

  @Column({ type: 'uuid', nullable: true })
  deliveryId: string;

  @Column({ type: 'int' })
  productAmountInCents: number;

  @Column({ type: 'int', default: 0 })
  baseFeeInCents: number;

  @Column({ type: 'int', default: 0 })
  deliveryFeeInCents: number;

  @Column({ type: 'int' })
  totalAmountInCents: number;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wompiTransactionId: string;

  @Column({ type: 'varchar', length: 50, default: 'CARD' })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
