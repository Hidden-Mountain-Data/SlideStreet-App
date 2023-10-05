import { Sim } from '../../sims/entities/sim.entity';
import { Router } from '../entities/router.entity';

export interface SimAndRouterInfo {
  sim: Sim;
  router: Router;
}
