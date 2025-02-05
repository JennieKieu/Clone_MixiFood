export const en = {
  common: {
    login: 'LOGIN',
    signup: 'SIGN UP',
    user: 'User',
    restaurant: 'Restaurant',
    next: 'Next',
    logout: 'Log Out',
    setting: 'Settings',
    cancel: 'Cancel',
    active: 'active',
    selectRole: 'Select Role',
    fail: 'Fail',
    success: 'Success',
    ok: 'Agree',
    confirm: 'Confirm',
    edit: 'Edit',
    view: 'View',
    avatar: 'Avatar image',
    coverImage: 'Cover avatar',
    detail: 'Detail',
    save: 'Save',
    forRestaurant: 'for restaurant',
    totalPrice: 'Total Price',
    pay: 'Pay',
    complete: 'Complete',
    payNow: 'Pay now',
    print: 'Print',
    address: 'Address',
    time: 'Time',
    invoiceInformation: 'Invoice Information',
    cashPayment: 'Cash payment',
    employeeId: 'Employee Id',
    table: 'Table',
    pendingPayment: 'payments',
    seating: 'Seating',
    employee: 'Employee',
    descriptions: 'Descriptions',
    price: 'Price',
    invoiceId: 'Invoice id',
    booking: 'Booking',
    paymentHistory: 'Payment history',
    invoiceHistory: 'Invoice history',
    reset: 'Reset',
    apply: 'Apply',
    reservation: 'Booking',
    directions: 'Directions',
    continue: 'Continue',
    paymentmethod: 'Payment method',
    addPayment: 'Add',
    statistical: 'Statistical',
    review_invoice: 'Review invoice',
    filter: 'Filter',
    all: 'All',
  },
  statistical: {},
  intro: {
    welcome: 'Welcome to MixiFood',
    message:
      'Enjoy the ease of booking tables instantly with just one tap, ensuring your spot is reserved without any hassle.',
    title1: 'Real-time Chat with Restaurants',
    message1:
      'Connect directly with restaurants for special requests or support through real-time chat.',
    title2: 'Restaurant Management',
    message2:
      'Efficiently manage bookings, customers, and communications with our professional restaurant management system.',
    title3: 'welecome to MixiFood',
    message3:
      'Enjoy the ease of booking tables instantly with just one tap, ensuring your spot is reserved without any hassle.',
  },
  seating: {
    name: 'Seat name',
  },
  smsScreen: {
    title: 'Verification code has been sent to +{{phoneNumber}}',
    span: 'Enter the confirmation code received below',
    resend: 'resend the code ',
    countDown: '{{countDown}}',
    errorMsg: {
      title: 'Failure',
      message: 'sms otp is wrong',
    },
    modal: {
      confirmSetLocation:
        'your account is successfully verified, please update the restaurant location on the map!',
    },
  },
  appBottomTabbar: {
    user: {
      Home: 'Home',
      NearYou: 'NearYou',
      Messages: 'Messages',
      Posts: 'Posts',
      Menu: 'Menu',
    },
    restaurant: {
      Home: 'Home',
      Employee: {
        label: 'Employee',
        title: 'Employee Manager',
      },
      Menu: {
        label: 'Menu',
        title: 'Menu Manager',
      },
      profile: 'Profile',
      seating: {
        label: 'Seating',
        title: 'Seating Manager',
      },
    },
  },
  input: {
    email: {
      label: 'Email',
      placeholder: 'Email',
    },
    fullName: {
      label: 'Full Name',
      placeholder: 'Full name',
    },
    phoneNumber: {
      label: 'Phone Number',
      placeholder: 'Phone number',
    },
    password: {
      label: 'Passowrd',
      placeholder: 'Password',
    },
    restaurantName: {
      label: 'Restaurant name',
      placeholder: 'Restaurant name',
    },
    address: {
      label: 'Address',
      placeholder: 'Address',
    },
    confirmPassword: {
      label: 'Confirm password',
      placeholder: 'Confirm password',
    },
    foodName: {
      label: 'Food name',
      placeholder: 'Food name',
    },
    foodUnit: {
      label: 'Food unit',
      placeholder: 'Food unit',
    },
    foodPrice: {
      label: 'Food price',
      placeholder: 'Food price',
    },
    isDeleteFoodBg: {
      label: 'Delete the background of the food image',
    },
    seatName: {
      label: 'Seat name',
      placeholder: 'Seat name',
    },
    maxPeople: {
      label: 'Max of people',
      placeholder: '2, 4, 6',
    },
    createMultiSeat: {
      label: 'Seats',
      placeholder: 'Enter the number of seats to be automatically created',
    },
    confirmLocation: {
      label: 'The restaurants location will be updated here',
    },
  },
  errorMessage: {
    input: {
      compare: '{{input}} must match',
      required: 'Please, make sure you fill in {{input}}.',
      incorrect: 'Please, make sure you fill correct information.',
      email: 'Please enter a valid email address',
      phoneNumberUsed:
        'phone number has been used, Please use another phone number',
      emailUsed: 'Email has been used, Please use another Email',
    },
    minLength: ' must be at least {{length}} characters',
    maxLength: ' the length must be less than or equal to {{length}}',
    phoneNumberNotFound: 'phone number does not exist',
    internet: 'Check your intenet and try again!',
  },
  EmployeeScreen: {
    EmployeeOptionsBottomSheet: {
      edit: 'Edit Employee',
      delete: 'Delete Employee',
      add: 'Add Employee',
    },
    AddEmployeeBottomSheet: {
      title: 'Add Employee',
      addSuccess: 'Add employee success',
    },
    modal: {
      deleteTitle: 'Confirm employee deletion',
      deleteContent: 'This action cannot be undone!',
      deleteSuccess: 'Employee has been deleted',
    },
    errorMsg: {
      addFail: '',
    },
  },
  seatingScreen: {
    addSeatBottomSheet: {
      addMulti: 'Add multi seats',
      addOne: 'Add seat',
    },
  },
  menuFoodScreen: {
    menuOptionsBottomSheet: {
      edit: 'Edit food',
      delete: 'Delete food',
    },
    modal: {
      deleteTitle: 'Confirm food deletion',
      deleteContent: 'This action cannot be undone!',
      deleteSuccess: 'Food has been deleted',
    },
  },
  confirmOrderScreenByEmployee: {
    title: {
      1: 'My',
      2: 'Order List',
    },
    alert: {
      orderSuccess: {
        title: 'OrderSuccess',
      },
    },
  },
  MenuScreen: {
    addFoodBottomSheet: {
      add: 'Add food',
    },
  },
  appSettings: {
    theme: {
      title: 'Theme Setting',
    },
    language: {
      title: 'Language Setting',
    },
  },
  verifySmsModal: {
    title: {
      1: 'Account has not been activated',
      2: 'Active now ?',
    },
  },
  EmployeeRole: {
    manage: 'Manage',
    security: 'Security',
    serve: 'Serve',
    chef: 'Chef',
  },
  ProfileScreen: {
    avatarBottom: {
      editAvatar: 'Edit avatar',
      viewAvatar: 'View avatar',
      editCover: 'Edit cover image',
      viewCover: 'View cover image',
    },
  },
  edit: {},
  view: {},
  preview: {
    previewAvatar: 'Preview avatar image',
  },
  status: {
    pending: 'Pending',
    success: 'Success',
    cancel: 'Cancel',
    complete: 'Complete',
  },
  time: {
    time: 'Time',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    year: 'Year',
  },
  requestUpdate: {
    location: {
      title: 'map update',
      message:
        'The restaurant has not updated its location on the map. Update now!',
    },
  },
  tableBooking: {
    bookingInfomation: 'Booking infomation',
    numberOfAdults: 'Number of adults',
    numberOfChildren: 'Number of children',
    date: 'Date',
    time: 'Time',
    note: 'Note',
    noteInput: 'Input note',
  },
  seatingStatus: {
    serving: 'Serving',
    booking: 'Booking',
    paying: 'Paying',
  },
};
export type TTranslations = typeof en;
