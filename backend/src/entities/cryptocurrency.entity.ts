import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'cryptocurrencies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Cryptocurrency extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare symbol: string;

  @Column({ type: DataType.DECIMAL(18, 8), allowNull: false })
  declare price: number;
}
