import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiTags('Wallet') 
@Controller('wallet')
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor', 'user')
  @Get(':userId')
  async getWallet(@Param('userId') userId: number) {
    return this.walletService.getWalletByUser(userId);
  }
}
