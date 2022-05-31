import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { MintRequestDto } from './dtos/mint-request.dto';

@Controller('contract')
@ApiTags('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get('token-balance/:address')
  @ApiOperation({
    summary: 'Token balance',
    description: 'Gets the token balance of the provided address',
  })
  @ApiResponse({
    status: 200,
    description: 'Token balance',
    type: Number,
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getTokenBalance(@Param('address') address: string) {
    try {
      const result = await this.contractService.tokenBalanceOf(address);
      return Number(result);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }

  @Post('mint-token')
  @ApiOperation({
    summary: 'Mint Token',
    description:
      'Requests the server to mint a given amount of tokens to a provided address',
  })
  @ApiResponse({
    status: 201,
    description: 'Token balance',
    type: Number,
  })
  // Possible server errors: The server is not connected to a valid provider, or the owner account is not set up, or the contract is not correctly set up, or the owner account has run out of balance to pay gas
  // Too much info for an error description
  @ApiResponse({
    status: 503,
    description:
      'Server Error',
    type: HttpException,
  })
  async mintToken(@Body() mintRequestDto: MintRequestDto) {
    try {
      const result = await this.contractService.mintTokens(
        mintRequestDto.address,
        mintRequestDto.amount,
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }

  @Get('token-total-supply/')
  @ApiOperation({
    summary: 'Total supply',
    description: 'Gets the total supply of the deployed token contract',
  })
  @ApiResponse({
    status: 200,
    description: 'Total supply',
    type: Number,
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getAllownceOf() {
    try {
      const result = await this.contractService.tokenTotalSupply();
      return Number(result);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }

  @Get('allowance-of/:ownerAddress:spenderAddress')
  @ApiOperation({
    summary: 'Allownce of owner to spender',
    description: 'Gets the allowance amount of the owner to the apender',
  })
  @ApiResponse({
    status: 200,
    description: 'Allowance amount',
    type: Number,
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getAllowance(@Param('ownerAddress') ownerAddress: string,
  @Param('spenderAddress') spenderAddress: string) {
    try {
      const result = await this.contractService.allownanceOf(
        ownerAddress,
        spenderAddress
      );
      return Number(result);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }
}
