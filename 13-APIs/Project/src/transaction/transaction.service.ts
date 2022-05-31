import { Injectable } from '@nestjs/common';
import { ProviderService } from 'src/shared/services/provider/provider.service';


@Injectable()
export class TransactionService {
  constructor(private providerService: ProviderService) {}

  async getTxStatusByHash(hash: string) {
    return await this.providerService.getTxStatusByHash(hash);
  }

  async getTxReceiptByHash(hash: string) {
    return await this.providerService.getTxReceiptByHash(hash);
  }

}
