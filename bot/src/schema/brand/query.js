import gql from 'graphql-tag'

import { brandInfo } from './fragment'

export const getVehicleBrandQuery = gql`
  query($tenant: String, $vehicleType: String!, $filter: VehicleFilter) {
    brand(tenant: $tenant, vehicleType: $vehicleType, filter: $filter) {
      ...brand
    }
  }
  ${brandInfo}
`
