import { Controller, Get, HttpException, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';


@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('txStatus/:hash')
  @ApiOperation({
    summary: 'Transaction status by hash',
    description: 'Return the status of a transaction that matches the provided hash',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction status',
  })
  @ApiResponse({
    status: 404,
    description: 'Tx not found',
    type: HttpException,
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getTxStatusByHash(@Param('hash') hash: string) {
    let result;
    try {
      result = await this.transactionService.getTxStatusByHash(hash);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
    if (!result) throw new HttpException('Tx not found', 404);
    return result;
  }

  @Get('txReceipt/:hash')
  @ApiOperation({
    summary: 'Transaction receipt by hash',
    description: 'Return the receipt of a transaction that matches the provided hash',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction receipt',
  })
  @ApiResponse({
    status: 404,
    description: 'Tx not found',
    type: HttpException,
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getTxReceiptByHash(@Param('hash') hash: string) {
    let result;
    try {
      result = await this.transactionService.getTxReceiptByHash(hash);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
    if (!result) throw new HttpException('Tx not found', 404);
    return result;
  }
}
