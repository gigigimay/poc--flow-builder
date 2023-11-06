export default {
  command: {
    interested: 'สนใจประกัน',
    other_services: 'สอบถามข้อมูล',
    promotion: 'สนใจดูโปรโมชันประกัน',
    other_insurance: 'ประกันภัยอื่นๆ',
  },
  title: {
    bought_previously:
      'คุณลูกค้าเคยซึ้อประกันรถกับกรุงศรี ออโต้ โบรคเกอร์ไหมคะ',
    welcome_new_customer: 'สำหรับลูกค้าใหม่กรุณาเลือกประเภทรถ',
    choose_car_type: 'กรุณาเลือกประเภทรถ',
    choose_car_brand: 'กรุณาเลือกยี่ห้อรถ',
    choose_car_tier: 'กรุณาเลือกประเภทประกัน',
    choose_premiums_below: 'เลือกดูเบี้ยประกันสุดคุ้มด้านล่างนี้ได้เลยค่ะ',
    contact_agent_waiting: 'เจ้าหน้าที่กำลังมาให้บริการค่ะ\nกรุณารอสักครู่นะคะ',
    contact_agent_other:
      'ต้องการสอบถามข้อมูลใดคะ สามารถพิมพ์คำถามไว้ได้เลยค่ะ สักครู่จะมีเจ้าหน้าที่มาให้บริการค่ะ',
    contact_agent_schedule:
      'หรือหากสะดวกให้เจ้าหน้าที่โทรกลับกดปุ่มด้านล่างได้เลยค่ะ',
    confirm_product_thankyou:
      'ขอบคุณค่ะ 🙏 คานะจะส่งข้อมูลให้เจ้าหน้าที่ดูแลต่อนะคะ',
    confirm_product_contact_agent:
      'หากต้องการให้เจ้าหน้าที่ติดต่อกลับ\nกดปุ่มได้เลยค่ะ',
    further_questions: 'หากมีข้อสงสัยเพิ่มเติม\nกดปุ่มด้านล่างได้เลยนะคะ',
    fill_registration:
      'สำหรับลูกค้า กรุงศรี ออโต้ โบรคเกอร์ หากต้องการต่ออายุกรมธรรม์อย่างรวดเร็ว กดปุ่ม ⬇️ เพื่อกรอกข้อมูลได้เลยค่ะ',
    lifetime_between_180_121:
      'ประกันภัยรถของคุณยังคุ้มครองถึง {{session.data.expireDateLocalisedString}}',
    lifetime_between_120_1:
      'ประกันภัยรถทะเบียน {{session.data.licensePlate}}\nจะสิ้นสุดความคุ้มครองในวันที่\n{{session.data.expireDateLocalisedString}}\nกรมธรรม์ปัจจุบัน ประกันภัยชั้น {{session.data.productType}}\nเบี้ยประกัน {{session.data.grossPremium}} บาท\nทุนประกัน {{session.data.si}} บาท',
    lifetime_expired_0_31:
      'ประกันภัยรถทะเบียน {{session.data.licensePlate}}\nสิ้นสุดความคุ้มครองแล้วเมื่อวันที่\n{{session.data.expireDateLocalisedString}}\nกรมธรรม์ปัจจุบัน ประกันภัยชั้น {{session.data.productType}}\nเบี้ยประกัน {{session.data.grossPremium}} บาท\nทุนประกัน {{session.data.si}} บาท',
    lifetime_expired_31_365:
      'ประกันภัยรถทะเบียน {{session.data.licensePlate}}\nสิ้นสุดความคุ้มครองแล้วเมื่อวันที่ {{session.data.expireDateLocalisedString}}',
    lifetime_expired_365:
      'ประกันภัยเดิมของรถทะเบียน {{session.data.licensePlate}}\nสิ้นสุดความคุ้มครองแล้วเมื่อวันที่ {{session.data.expireDateLocalisedString}}',
    lifetime_over_180:
      'ประกันภัยรถยนต์ของคุณ\nยังคุ้มครองถึง {{session.data.expireDateLocalisedString}}',
    offer_renewal:
      'คานะขอเสนอเบี้ยใบเตือนต่ออายุประกันภัย และเบี้ยแนะนําสําหรับคุณค่ะ',
    offer_premiums: 'คานะขอเสนอเบี้ยสุดคุ้มดังนี้ค่ะ',
    out_of_working_hours:
      'เนี่องจากอยู่นอกเวลาทําการ เจ้าหน้าที่จะดําเนินการตอบกลับให้เร็วที่สุดขออภัยในความไม่สะดวก ขอบคุณค่ะ',
    request_information_menu: 'กรุณาเลือกคำถาม',
    request_information: 'คุณต้องการสอบถามข้อมูล เกี่ยวกับอะไรคะ? 😊',
    contact_agent_prompt:
      'มีบางอย่างผิดพลาด กรุณากดปุ่มด้านล่างเพื่อติดต่อเจ้าหน้าที่',
    data_outdated:
      'เนื่องจากข้อมูลอาจมีการเปลี่ยนแปลง กรุณากดเลือกเมนู “สนใจประกันรถ” เพื่อทำรายการใหม่ค่ะ',
  },
  button: {
    bought_previously_yes: 'เคยซื้อ',
    bought_previously_no: 'ไม่เคยซื้อ',
    car: 'รถยนต์/รถกระบะ',
    car_tier_one: 'ชั้น 1',
    car_tier_two_plus: 'ชั้น 2+',
    car_tier_two: 'ชั้น 2',
    car_tier_three_plus: 'ชั้น 3+',
    car_tier_three: 'ชั้น 3',
    contact_agent: 'แชทกับเจ้าหน้าที่',
    contact_agent_schedule: 'กรอกเบอร์ติดต่อกลับ',
    fill_registration: 'กรอกทะเบียนรถ',
    message_car_tier_one: 'ประกันรถชั้น 1',
    message_car_tier_two_plus: 'ประกันรถชั้น 2+',
    message_car_tier_two: 'ประกันรถชั้น 2',
    message_car_tier_three_plus: 'ประกันรถชั้น 3+',
    message_car_tier_three: 'ประกันรถชั้น 3',
    more_product: 'ดูเบี้ยประกันเพิ่มเติม',
    motorcycle: 'บิ๊กไบค์',
    other_tier: 'ดูประกันภัยชั้นอื่น',
    policy_status_inquiry: 'สอบถามสถานะกรมธรรม์',
    submit_policy_document: 'ส่งเอกสารเกี่ยวกับประกันภัย',
    find_garage: 'ค้นหาอู่ซ่อมรถ',
    contact_sales_representative: 'ติดต่อเจ้าหน้าที่ฝ่ายขาย',
    ask_other_information: 'สอบถามข้อมูลอื่นๆ',
  },
  vehicleType: {
    car: 'รถยนต์',
    motorBike: 'บิ๊กไบค์',
  },
  answer: {
    car_choose_tier: 'ประกันรถชั้น',
    interested_in_product: 'สนใจแบบประกันชั้น',
    policy_renewal: 'ต่ออายุกรมธรรม์\nรถ',
    fill_in_for_searching_product: 'กรอกข้อมูลเพื่อค้นหาประกันภัย',
  },
  error: {
    assign_failed: 'ดำเนินการส่งข้อมูลไม่สำเร็จ กรุณาทำรายการใหม่อีกครั้งค่ะ',
    general: 'มีบางอย่างผิดพลาด กรุณาทํารายการใหม่ในภายหลัง',
  },
  validation: {
    invalid_car_type: 'ข้อมูลรถไม่ถูกต้อง กรุณาเลือกใหม่อีกครั้ง',
    invalid_car_brand: 'กรุณากรอกรุ่นรถให้ถูกต้อง',
    invalid_registration:
      'ข้อมูลการลงทะเบียนไม่ถูกต้อง กรุณากรอกทะเบียนรถเพื่อยืนยันตัวตนอีกครั้ง',
    invalid_choice: 'กรุณาเลือกตัวเลือกให้ถูกต้อง',
    invalid_process: 'กรุณาทำรายการให้ถูกต้อง',
    invalid_contact_agent:
      'กรุณากดแชทกับเจ้าหน้าที่ หรือกดเมนูด้านล่างเพื่อเริ่มต้นใหม่',
  },
}
