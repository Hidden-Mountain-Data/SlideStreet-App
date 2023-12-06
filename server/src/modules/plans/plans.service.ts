import { SimsService } from '../sims/sims.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PlanDTO } from './dto/plan.dto';
import { PrismaService } from 'src/services/prisma.service';
import { SSPlans } from '@prisma/client';
@Injectable()
export class PlansService {
  private readonly logger = new Logger(SimsService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getPlans(): Promise<SSPlans[]> {
    try {
      const plans = await this.prisma.sSPlans.findMany();
      return plans;
    } catch(error) {
      this.logger.error('Error getting plans:', error);
      throw error;
    }
  }

  async upsertPlans(plans: PlanDTO[]) {
    try {
      await this.prisma.$transaction(async (prisma) => {
        await Promise.all(
          plans.map(async (plan) => {
            await prisma.tealPlans.upsert({
              where: { name: plan.name },
              update: {
                name: plan.name,
                price: plan.price,
                smsPrice: plan.smsPrice,
                volume: plan.volume,
                volumeUnit: plan.volumeUnit,
                validityTime: plan.validityTime,
                validityTimeUnit: plan.validityTimeUnit,
                coverageCountries: plan.coverageCountries,
                coverageType: plan.coverageType,
                credentialsType: plan.credentialsType,
                maxReliability: plan.maxReliability,
                meerkatEnabled: plan.meerkatEnabled,
                minUnitPrice: plan.minUnitPrice,
                minUnitPriceBilling: plan.minUnitPriceBilling,
                minUnitVolume: plan.minUnitVolume,
                minUnitVolumeUnit: plan.minUnitVolumeUnit,
                networkTechType: plan.networkTechType,
                networkTechTypes: plan.networkTechTypes,
                networkTechTypeTitle: plan.networkTechTypeTitle,
                networkType: plan.networkType,
                profilePools: plan.profilePools,
                reliability: plan.reliability,
                skus: plan.skus,
                uuid: plan.uuid,
              },
              create: {
                tealPlanId: plan.id,
                name: plan.name,
                price: plan.price,
                smsPrice: plan.smsPrice,
                volume: plan.volume,
                volumeUnit: plan.volumeUnit,
                validityTime: plan.validityTime,
                validityTimeUnit: plan.validityTimeUnit,
                coverageCountries: plan.coverageCountries,
                coverageType: plan.coverageType,
                credentialsType: plan.credentialsType,
                maxReliability: plan.maxReliability,
                meerkatEnabled: plan.meerkatEnabled,
                minUnitPrice: plan.minUnitPrice,
                minUnitPriceBilling: plan.minUnitPriceBilling,
                minUnitVolume: plan.minUnitVolume,
                minUnitVolumeUnit: plan.minUnitVolumeUnit,
                networkTechType: plan.networkTechType,
                networkTechTypes: plan.networkTechTypes,
                networkTechTypeTitle: plan.networkTechTypeTitle,
                networkType: plan.networkType,
                profilePools: plan.profilePools,
                reliability: plan.reliability,
                skus: plan.skus,
                uuid: plan.uuid,
              },
            });
          })
        );
      });
    } catch(error) {
      this.logger.error('Error upserting plans:', error);
      throw error;
    }
  }
  async getSSPlanByTealPlanId(tealPlanId: number) {
    try {
      const plans = await this.prisma.sSPlans.findFirst({
        where: { tealPlanId },
      });
      return plans;
    } catch(error) {
      this.logger.error('Error getting plans:', error);
      throw error;
    }
  }
}
