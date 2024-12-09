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

  // Este método crea una sesión de pago de Stripe Checkout
  async createCheckoutSession(amount: number, userId: number): Promise<any> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    try {
      // Crear la sesión de pago de Stripe Checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'mxn', // Moneda
              product_data: {
                name: 'Recarga de saldo',
              },
              unit_amount: amount * 100, // Convertir a centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONT_END_URL}/creditos?status=success`, // Redirigir a una página de éxito
        cancel_url: `${process.env.FRONT_END_URL}/creditos?status=cancel`, // Redirigir a una página de cancelación
        metadata: { userId: userId.toString() },
      });

      // Devolvemos la URL de la sesión para que el cliente pueda ser redirigido
      return { url: session.url };
    } catch (error) {
      throw new BadRequestException('Error al crear la sesión de pago');
    }
  }

  async handlePaymentWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        // El pago fue exitoso, actualizar el saldo de la wallet
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = Number(session.metadata.userId); // Usamos el userId que pasamos en metadata
        const amount = session.amount_total / 100; // Convertimos de centavos a pesos
        await this.walletService.rechargeWallet(userId, amount);
        break;
      }
      
      case 'checkout.session.async_payment_succeeded': {
        // El pago se completó de manera asincrónica
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = Number(session.metadata.userId);
        const amount = session.amount_total / 100;
        await this.walletService.rechargeWallet(userId, amount);
        break;
      }
      
      case 'checkout.session.async_payment_failed': {
        // El pago asincrónico falló
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = Number(session.metadata.userId);
        // Aquí podrías notificar al usuario que el pago ha fallado
        break;
      }

      case 'checkout.session.expired': {
        // La sesión de pago expiró sin completar el pago
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = Number(session.metadata.userId);
        // Aquí podrías manejar si quieres notificar al usuario sobre la expiración
        break;
      }

      default:
        throw new BadRequestException('Evento no soportado');
    }
  }
}
