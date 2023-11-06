import gql from 'graphql-tag'
import { autoInsuranceProduct, recommendedProduct } from './fragment'

export const autoInsuranceProductQuery = gql`
  query autoInsuranceProduct(
    $autoInsuranceProductInput: AutoInsuranceProductInput
    $filter: ProductFilterInput
  ) {
    autoInsuranceProduct(
      autoInsuranceProductInput: $autoInsuranceProductInput
      filter: $filter
    ) {
      products {
        ...autoInsuranceProduct
      }
    }
  }
  ${autoInsuranceProduct}
`

export const recommendedProductQuery = gql`
  query recommendedProductsSearch(
    $recommendedProductInput: RecommendedProductInput
    $filter: ProductFilterInput
  ) {
    recommendedProductsSearch(
      recommendedProductInput: $recommendedProductInput
      filter: $filter
    ) {
      products {
        ...recommendedProduct
      }
    }
  }
  ${recommendedProduct}
`
