
export class PlanDTO {
  id: number
  name: string
  price: number
  smsPrice: number
  volume: number
  volumeUnit: string
  validityTime: number
  validityTimeUnit: string
  coverageCountries: [string]
  coverageType: string
  credentialsType: string
  maxReliability: number
  meerkatEnabled: boolean
  minUnitPrice: number
  minUnitPriceBilling: boolean
  minUnitVolume: number
  minUnitVolumeUnit: string
  networkTechType: string
  networkTechTypes: [string]
  networkTechTypeTitle: string
  networkType: string
  profilePools: [string]
  reliability: number
  skus: [string]
  uuid: string
}