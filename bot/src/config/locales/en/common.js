export default {
  command: {
    interested: 'สนใจประกัน',
    other_services: 'สอบถามข้อมูล',
    promotion: 'สนใจดูโปรโมชันประกัน',
    other_insurance: 'ประกันภัยอื่นๆ',
  },
  title: {
    bought_previously:
      'Have you ever bought car insurance with Krungsri Auto Broker?',
    welcome_new_customer: 'สำหรับลูกค้าใหม่กรุณาเลือกประเภทรถ',
    choose_car_type: 'กรุณาเลือกประเภทรถ',
    choose_car_brand: 'กรุณาเลือกยี่ห้อรถ',
    choose_car_tier: 'กรุณาเลือกประเภทประกัน',
    choose_premiums_below: 'เลือกดูเบี้ยประกันสุดคุ้มด้านล่างนี้ได้เลยค่ะ',
    contact_agent_waiting: 'เจ้าหน้าที่กำลังมาให้บริการค่ะ\nกรุณารอสักครู่นะคะ',
    contact_agent_other:
      'Want to ask any information? Please ask your question, there will be someone to serve you in a moment.',
    contact_agent_schedule:
      'หรือหากสะดวกให้เจ้าหน้าที่โทรกลับกดปุ่มด้านล่างได้เลยค่ะ',
    confirm_product_thankyou:
      'ขอบคุณค่ะ 🙏 คานะจะส่งข้อมูลให้เจ้าหน้าที่ดูแลต่อนะคะ',
    confirm_product_contact_agent:
      'หากต้องการให้เจ้าหน้าที่ติดต่อกลับ\nกดปุ่มได้เลยค่ะ',
    further_questions:
      'If you have any further questions, you can click the button below.',
    fill_registration:
      'For Krungsri Auto Broker customers, if you would like to renew your policy quickly, press the ⬇️ button below to check the status on the policy.',
    lifetime_between_180_121:
      'Your car insurance will cover untill {{session.data.expireDateLocalisedString}}.',
    lifetime_between_120_1:
      'The insurance policy of the vehicle with license plate {{session.data.licensePlate}} will expire soon on {{session.data.expireDateLocalisedString}}. The current insurance of class {{session.data.productType}}, has a premium of {{session.data.grossPremium}} Thai baht and covers up to {{session.data.si}} Thai baht.',
    lifetime_expired_0_31:
      'The insurance policy of the vehicle with license plate {{session.data.licensePlate}} has just expired on {{session.data.expireDateLocalisedString}}. The current insurance of class {{session.data.productType}}, has a premium of {{session.data.grossPremium}} Thai baht and covers up to {{session.data.si}} Thai baht.',
    lifetime_expired_31_365:
      'The insurance policy of the vehicle with license plate {{session.data.licensePlate}} has expired on {{session.data.expireDateLocalisedString}}.',
    lifetime_expired_365:
      'The original insurance policy of the vehicle with license plate {{session.data.licensePlate}} has expired on {{session.data.expireDateLocalisedString}}.',
    lifetime_over_180:
      'Your car insurance will cover untill {{session.data.expireDateLocalisedString}}.',
    offer_renewal:
      'Kana would like to offer you to renew your premium and recommends the following replacements:',
    offer_premiums: 'Kana would like to offer the best premium as follows:',
    out_of_working_hours:
      "We're currently outside of the operating hours. The staff will reply as soon as possible, we apologize for any inconvenience. Thank you.",
    request_information_menu: 'Please select a topic',
    request_information: 'What is your inquiry about? 😊',
    contact_agent_prompt:
      'มีบางอย่างผิดพลาด กรุณากดปุ่มด้านล่างเพื่อติดต่อเจ้าหน้าที่',
    data_outdated:
      'เนื่องจากข้อมูลอาจมีการเปลี่ยนแปลง กรุณากดเลือกเมนู “สนใจประกันรถ” เพื่อทำรายการใหม่ค่ะ',
  },
  button: {
    bought_previously_yes: "I've bought before",
    bought_previously_no: 'I have never',
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
    policy_status_inquiry: 'view policy status',
    submit_policy_document: 'submit insurance documents',
    find_garage: 'find a garage',
    contact_sales_representative: 'contact insurance agent',
    ask_other_information: 'other information',
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
    invalid_car_type: 'Invalid car type',
    invalid_car_brand: 'Invalid answer, please select car brand again',
    invalid_registration:
      'Invalid registration information Please enter your vehicle registration to verify your identity again.',
    invalid_choice: 'Please select one of the options above.',
    invalid_process: 'Invalid answer, please try again',
    invalid_contact_agent:
      'กรุณากดแชทกับเจ้าหน้าที่ หรือกดเมนูด้านล่างเพื่อเริ่มต้นใหม่',
  },
}
