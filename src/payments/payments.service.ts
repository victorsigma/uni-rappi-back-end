import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { WalletService } from 'src/wallet/wallet.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly walletService: WalletService, private readonly userService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(amount: number, userId: number): Promise<any> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    try {
      // Crear el Payment Intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convertir a centavos
        currency: 'mxn', // Moneda
        payment_method_types: ['card'], // Métodos de pago permitidos
        metadata: { userId: userId.toString() }, // Información extra
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al crear el Payment Intent');
    }
  }

  async handlePaymentWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        // El pago fue exitoso, actualizar el saldo de la wallet
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = Number(paymentIntent.metadata.userId); // Usamos el userId que pasamos en metadata
        const amount = paymentIntent.amount_received / 100; // Convertimos de centavos a pesos
        await this.walletService.rechargeWallet(userId, amount);
        break;
      }

      case 'payment_intent.payment_failed': {
        // El pago falló, puedes notificar al usuario
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = Number(paymentIntent.metadata.userId);
        const amount = paymentIntent.amount_received / 100;
        // Aquí puedes notificar al usuario que el pago ha fallado
        break;
      }

      case 'payment_intent.canceled': {
        // El pago fue cancelado
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = Number(paymentIntent.metadata.userId);
        // Aquí podrías manejar si quieres notificar al usuario sobre la cancelación
        break;
      }

      default:
        throw new BadRequestException('Evento no soportado');
    }
  }
}
