import { Controller, Post, Body, Req, HttpCode, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { PaymentsDto } from './dto/payments.dto';

@ApiTags('Payments') 
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendedor', 'user')
  @Post('create-intent')
  async createPaymentIntent(@Body() body: PaymentsDto) {
    return this.paymentsService.createPaymentIntent(body.amount, body.userId);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Req() req: any, @Res() res: any) {
    const event = req.body;

    try {
      await this.paymentsService.handlePaymentWebhook(event);
      res.status(200).send('Evento recibido');
    } catch (error) {
      res.status(400).send('Evento rechazado');
    }
  }
}
