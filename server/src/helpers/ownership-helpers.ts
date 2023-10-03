import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoutersService } from '../modules/routers/services/routers.service';
import { SimsService } from '../modules/sims/sims.service';

@Injectable()
export class OwnershipHelpers {
  constructor(
    private readonly routersService: RoutersService,
    private readonly simsService: SimsService,
  ) {}

  async ensureRouterOwnership(routerId: number, userId: number): Promise<void> {
    const isOwned = await this.routersService.isRouterOwnedByUser(
      routerId,
      userId,
    );
    if (!isOwned) {
      throw new HttpException(
        'This router is not accessible to the current account',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async ensureSimOwnership(simId: number, userId: number): Promise<void> {
    const isOwned = await this.simsService.isSimOwnedByUser(simId, userId);
    if (!isOwned) {
      throw new HttpException(
        'This SIM is not accessible to the current account',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
