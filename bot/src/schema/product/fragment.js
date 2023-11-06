import gql from 'graphql-tag'

export const details = gql`
  fragment details on AutoInsuranceProductDetail {
    insurer
    insurerCD
    logo
    cover {
      backgroundColor
      gradientStart
      gradientEnd
      url
    }
    insuranceTier
    deductible
    garageType
    sumInsured
    personalCoverageDetail
    premiumPerYear
    thirdPartyCoverage {
      accidentCoverage {
        perPerson
        perRound
        propertyCoverage
      }
      additionalCoverage {
        personalAccident
        hospitality
        additional
      }
    }
    totalPremium
    fireTheft
  }
`

export const promotions = gql`
  fragment promotions on AutoInsuranceProductPromotion {
    id
    content
    discount
    tag
    url
    withCondition
    campaignCode
  }
`

export const autoInsuranceProduct = gql`
  fragment autoInsuranceProduct on AutoInsuranceProduct {
    id
    detail {
      ...details
    }
    promotions {
      ...promotions
    }
    fetchedDate
  }
  ${details}
  ${promotions}
`

export const recommendedProduct = gql`
  fragment recommendedProduct on RecommendedProduct {
    id
    isOldPolicy
    detail {
      ...details
    }
    promotions {
      ...promotions
    }
    fetchedDate
  }
  ${details}
  ${promotions}
`
