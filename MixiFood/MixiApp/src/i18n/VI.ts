import {TTranslations} from './EN';

export const vi: TTranslations = {
  common: {
    login: 'ĐĂNG NHẬP',
    signup: 'ĐĂNG KÝ',
    user: 'Người dùng',
    restaurant: 'Nhà hàng',
    next: 'Tiếp',
    logout: 'Đăng xuất',
    setting: 'Cài đặt',
    cancel: 'Huỷ',
    active: 'kích hoạt',
    selectRole: 'Chọn vị trí',
    confirm: 'Xác nhận',
    success: 'Thành công',
    fail: 'Thất bại',
    ok: 'Đồng ý',
    edit: 'Chỉnh sửa',
    view: 'View',
    avatar: 'Ảnh đại diện',
    coverImage: 'Ảnh bìa',
    detail: 'Chi tiết',
    forRestaurant: 'Dành cho nhà hàng',
    address: 'Địa chỉ',
    cashPayment: 'Thanh toán bằng tiền mặt',
    complete: 'Hoàn thành',
    descriptions: 'Mô tả',
    employee: 'Nhân viên',
    employeeId: 'Mã nhân viên',
    invoiceId: 'Mã hoá đơn',
    invoiceInformation: 'Thông tin hoá đơn',
    pay: 'Thanh toán',
    payNow: 'Thanh toán ngay',
    pendingPayment: 'Đang chờ thanh toán',
    price: 'Giá',
    print: 'In',
    save: 'Lưu',
    seating: 'Chổ ngồi',
    table: 'Bàn',
    time: 'Thời gian',
    totalPrice: 'Tổng tiền',
    reservation: 'Đặt chổ',
    directions: 'Chỉ đường',
    apply: 'Áp dụng',
    booking: 'Đặt bàn',
    invoiceHistory: 'Lịch sử hoá đơn',
    paymentHistory: 'Lịch sử thanh toán',
    reset: 'Đặt lại',
    continue: 'Tiếp tục',
    addPayment: 'Thêm',
    paymentmethod: 'Phương thức thanh toán',
    statistical: 'Thống kê',
    review_invoice: 'Xem lại hoá đơn',
    filter: 'Lọc',
    all: 'Tất cả',
  },
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
  appSettings: {
    theme: {
      title: 'Cài đặt giao diện',
    },
    language: {
      title: 'Cài đặt ngôn ngữ',
    },
  },
  smsScreen: {
    title: 'Mã xác minh đã được gửi tới +{{phoneNumber}}',
    span: 'Nhập mã xác nhận nhận được bên dưới',
    resend: 'gửi lại mã ',
    countDown: '{{countDown}}',
    errorMsg: {
      title: 'Thất bại',
      message: 'Mã xác minh không chính xác',
    },
    modal: {
      confirmSetLocation:
        'Xác thực tài khoản thành công. Vui lòng cập nhật vị trí cửa hàng trên bản đồ',
    },
  },
  MenuScreen: {
    addFoodBottomSheet: {
      add: 'Thêm món',
    },
  },
  appBottomTabbar: {
    user: {
      Home: 'Trang chủ',
      NearYou: 'Gần bạn',
      Messages: 'Tin nhắn',
      Posts: 'Bài viết',
      Menu: 'Menu',
    },
    restaurant: {
      Home: 'Trang chủ',
      Employee: {
        label: 'Nhân viên',
        title: 'Quản lý nhân viên',
      },
      Menu: {
        label: 'Menu',
        title: 'Quản lý menu',
      },
      profile: 'Trang cá nhân',
      seating: {
        label: 'Bàn',
        title: 'Quản lý chổ ngồi',
      },
    },
  },
  errorMessage: {
    input: {
      compare: '{{input}} phải phù hợp',
      required: 'Không được để trống {{input}}.',
      incorrect: 'Vui lòng đảm bảo bạn điền thông tin chính xác.',
      email: 'Vui lòng nhập địa chỉ email hợp lệ.',
      phoneNumberUsed: 'Số điện thoại này đã được sử dụng !',
      emailUsed: 'Email này đã được sử dụng!',
    },
    minLength: ' ít nhất phải có {{length}} ký tự',
    maxLength: ' chiều dài phải nhỏ hơn hoặc bằng {{length}}',
    phoneNumberNotFound: 'Số điện thoại không tồn tại',
    internet: 'Kiểm tra lại internet và thử lại!',
  },
  EmployeeScreen: {
    EmployeeOptionsBottomSheet: {
      edit: 'Chỉnh sửa nhân viên',
      delete: 'Xoá Nhân viên',
      add: 'Thêm nhân viên',
    },
    AddEmployeeBottomSheet: {
      title: 'Thêm Nhân viên',
      addSuccess: 'Thêm nhân viên thành công',
    },
    errorMsg: {
      addFail: '',
    },
    modal: {
      deleteTitle: 'Xác nhận xoá nhân viên',
      deleteContent: 'Hành động này không thể hoàn tác!',
      deleteSuccess: 'Đã xoá nhân viên',
    },
  },
  input: {
    email: {
      label: 'Email',
      placeholder: 'Email',
    },
    fullName: {
      label: 'Họ tên',
      placeholder: 'Họ tên',
    },
    phoneNumber: {
      label: 'Số điện thoại',
      placeholder: 'Số điện thoại',
    },
    password: {
      label: 'Mật khẩu',
      placeholder: 'Mật khẩu',
    },
    restaurantName: {
      label: 'Tên nhà hàng',
      placeholder: 'Tên nhà hàng',
    },
    address: {
      label: 'Địa chỉ',
      placeholder: 'Địa chỉ',
    },
    confirmPassword: {
      label: 'Nhập lại mật khẩu',
      placeholder: 'Nhập lại mật khẩu',
    },
    confirmLocation: {
      label: 'vị trí của nhà hàng sẽ được cập nhật ở đây',
    },
    createMultiSeat: {
      label: 'Seats',
      placeholder: 'Nhập số lượn chổ ngồi cần tự động tạo',
    },
    foodName: {
      label: 'Tên món',
      placeholder: 'Tên món',
    },
    foodPrice: {
      label: 'Giá món',
      placeholder: 'Giá món',
    },
    foodUnit: {
      label: 'Food unit',
      placeholder: 'Food unit',
    },
    isDeleteFoodBg: {
      label: 'Xoá nền cho hình ảnh món ăn',
    },
    maxPeople: {
      label: 'Số người tối đa',
      placeholder: '2, 4, 6',
    },
    seatName: {
      label: 'Tên chổ ngồi',
      placeholder: 'Tên chổ ngồi',
    },
  },
  EmployeeRole: {
    manage: 'Quản lý',
    security: 'Bảo vệ',
    serve: 'Phục vụ',
    chef: 'Bếp',
  },
  // edit: {},
  // view: {},
  requestUpdate: {
    location: {
      title: 'Cập nhật vị trí cửa hàng',
      message:
        'Nhà hàng chưa cập nhật vị trí trên bản đồ. Cập nhật ngay bây giờ!',
    },
  },
  tableBooking: {
    bookingInfomation: 'Thông tin đặt chổ',
    date: 'Ngày đến',
    note: 'Ghi chú',
    numberOfAdults: 'Số người lớn',
    numberOfChildren: 'Số trẻ em',
    time: 'Giờ đến',
    noteInput: 'Nhập ghi chú',
  },
  confirmOrderScreenByEmployee: {
    title: {
      1: 'My',
      2: 'Order List',
    },
    alert: {
      orderSuccess: {
        title: 'Order thành công',
      },
    },
  },
  edit: {},
  view: {},
  preview: {
    previewAvatar: 'Xem trước hình đại diện',
  },
  menuFoodScreen: {
    menuOptionsBottomSheet: {
      edit: 'Chỉnh sửa món',
      delete: 'Xoá món',
    },
    modal: {
      deleteTitle: 'Xác nhận xoá món này',
      deleteContent: 'hành động này không thể hoàn tác!',
      deleteSuccess: 'Đã xoá thành công',
    },
  },
  ProfileScreen: {
    avatarBottom: {
      editAvatar: 'Sửa ảnh đại diện',
      editCover: 'Sửa ảnh bìa',
      viewAvatar: 'Xem ảnh đại diện',
      viewCover: 'Xem ảnh bìa',
    },
  },
  seating: {
    name: 'Tên chổ ngồi',
  },
  seatingScreen: {
    addSeatBottomSheet: {
      addMulti: 'Thêm nhiều chổ ngồi',
      addOne: 'Thêm chổ ngồi',
    },
  },
  status: {
    pending: 'Chờ',
    success: 'Thành công',
    complete: 'Hoành thành',
    cancel: 'Huỷ',
  },
  time: {
    day: 'Ngày',
    month: 'Tháng',
    time: 'Giờ',
    week: 'Tuần',
    year: 'Năm',
  },
  verifySmsModal: {
    title: {
      1: 'Tài khoản chưa được xác minh',
      2: 'Xác minh ngay ?',
    },
  },
  seatingStatus: {
    booking: 'Đặt bàn',
    paying: 'Thanh toán',
    serving: 'Phục vụ',
  },
};
