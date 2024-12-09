import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Wallet } from './wallet.entity';


@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly entityManager: EntityManager
  ) {}

  async getWalletByUser(userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { user: { id: userId } } });
    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada para este usuario.');
    }
    return wallet;
  }

  async rechargeWallet(userId: number, amount: number): Promise<Wallet> {
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('El monto a recargar debe ser un número positivo.');
   }
   const wallet = await this.getWalletByUser(userId);
   const currentBalance = parseFloat(wallet.balance.toString());

   return await this.entityManager.transaction(async (transactionalEntityManager) => {
     wallet.balance = parseFloat((currentBalance + amount).toFixed(2));
     return await transactionalEntityManager.save(wallet);
   });
  }
}
