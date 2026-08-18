import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('merchant')
  @ApiOperation({ summary: 'Obtener configuración del comercio y token de aceptación' })
  @ApiResponse({ status: 200, description: 'Datos del comercio Sandbox' })
  async getMerchant() {
    return this.checkoutService.getMerchantInfo();
  }

  @Post('pay')
  @ApiOperation({ summary: 'Procesar pago completo y crear registro de transacción' })
  @ApiResponse({ status: 201, description: 'Resultado de la transacción' })
  async pay(@Body() dto: CreatePaymentDto) {
    return this.checkoutService.processPayment(dto);
  }

  @Get('transaction/:id')
  @ApiOperation({ summary: 'Consultar estado de una transacción por ID' })
  @ApiResponse({ status: 200, description: 'Detalle de la transacción' })
  async getTransaction(@Param('id') id: string) {
    return this.checkoutService.getTransactionById(id);
  }
}
