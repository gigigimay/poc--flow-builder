import moment from 'moment'
import {
  formatCurrency,
  formatInteger,
  checkLifeTimeDiff,
  calculateTimeDiff,
  localisedFormat,
  isOutOfWorkingHours,
} from './data'

describe('utils data', () => {
  describe('formatCurrency', () => {
    const feature = {
      setting: {
        format: {
          currency: {
            decimals: 2,
            showZeroWithDecimals: false,
          },
        },
      },
    }
    it('should return formatted number', () => {
      expect(formatCurrency(feature)(0)).toEqual('0')
      expect(formatCurrency(feature)(1000)).toEqual('1,000.00')
    })
  })

  describe('formatInteger', () => {
    const feature = {
      setting: {
        format: {
          integer: {
            decimals: 0,
            showZeroWithDecimals: false,
          },
        },
      },
    }
    it('should return formatted number', () => {
      expect(formatInteger(feature)(0)).toEqual('0')
      expect(formatInteger(feature)(1000)).toEqual('1,000')
    })
  })

  describe('test localisedFormat', () => {
    it('should return budhist year when th locale', () => {
      expect(localisedFormat(moment('2000-11-24'), 'th')).toEqual('24/11/2543')
      expect(localisedFormat(moment('2000-11-24'), 'th', 'YYYY-MM-DD')).toEqual(
        '2543-11-24'
      )
    })
    it('should return normal year when not th locale', () => {
      expect(localisedFormat(moment('2000-11-24'))).toEqual('24/11/2000')
      expect(localisedFormat(moment('2000-11-24'), 'en')).toEqual('24/11/2000')
      expect(localisedFormat(moment('2000-11-24'), 'en', 'YYYY-MM-DD')).toEqual(
        '2000-11-24'
      )
    })
  })

  describe('test calculateTimeDiff', () => {
    it('should return added or subtracted days', () => {
      expect(
        calculateTimeDiff({
          data: {
            expireDate: moment()
              .add(1, 'years')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(365)
      expect(
        calculateTimeDiff({
          data: {
            expireDate: moment()
              .add(15, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(15)
      expect(
        calculateTimeDiff({
          data: {
            expireDate: moment()
              .subtract(15, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(-15)
    })
  })

  describe('test checkLifeTimeDiff', () => {
    let diff
    it('should return true if lifetimes are inside of range', () => {
      diff = checkLifeTimeDiff(undefined, 180) // no left boundary
      expect(
        diff({
          data: {
            expireDate: moment()
              .add(1, 'years')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(true)
      diff = checkLifeTimeDiff(180, 120) // positive range (alive)
      expect(
        diff({
          data: {
            expireDate: moment()
              .add(140, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(true)
      diff = checkLifeTimeDiff(0, -31) // negative range (expired)
      expect(
        diff({
          data: {
            expireDate: moment()
              .subtract(5, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(true)
      diff = checkLifeTimeDiff(365, undefined) // no right boundary (expired before)
      expect(
        diff({
          data: {
            expireDate: moment()
              .subtract(2, 'years')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(true)
    })
    it('should return false if lifetimes are out of range', () => {
      diff = checkLifeTimeDiff(undefined, 180) // no left boundary
      expect(
        diff({
          data: {
            expireDate: moment()
              .add(40, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(false)
      diff = checkLifeTimeDiff(180, 120) // positive range (alive)
      expect(
        diff({
          data: {
            expireDate: moment()
              .add(190, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(false)
      diff = checkLifeTimeDiff(0, -31) // negative range (expired)
      expect(
        diff({
          data: {
            expireDate: moment()
              .add(4, 'days')
              .format('YYYYMMDD'),
          },
        })
      ).toEqual(false)
      diff = checkLifeTimeDiff(-365, undefined) // no right boundary (expired before)
      expect(
        diff({
          data: { oldInsurance: { expireDate: moment().format('YYYYMMDD') } },
        })
      ).toEqual(false)
    })
  })

  describe('test isOutOfWorkingHours', () => {
    const feature = {
      workingHour: {
        start: 9,
        end: 18,
      },
    }
    it('should return true when weekend', () => {
      expect(isOutOfWorkingHours(feature)('2021-07-17T11:16:48')).toEqual(true)
      expect(isOutOfWorkingHours(feature)('2021-07-18T11:16:48')).toEqual(true)
    })
    it('should return true when morning or late evening', () => {
      expect(isOutOfWorkingHours(feature)('2021-07-19T04:20:00')).toEqual(true)
      expect(isOutOfWorkingHours(feature)('2021-07-19T18:55:55')).toEqual(true)
    })
    it('should return false when weekday first hour of the working day', () => {
      expect(isOutOfWorkingHours(feature)('2021-07-19T09:00:00')).toEqual(
        false
      )
    })
    it('should return false when weekday in random hour of the working day', () => {
      expect(isOutOfWorkingHours(feature)('2021-07-19T11:16:48')).toEqual(
        false
      )
    })
    it('should return false when weekday in last hour of the working day', () => {
      expect(isOutOfWorkingHours(feature)('2021-07-30T17:59:59')).toEqual(
        false
      )
    })
  })
})
