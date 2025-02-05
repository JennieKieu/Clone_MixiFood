import { HashAlgorithm, VNPay } from 'vnpay';

export const vnpayConfig = new VNPay({
  tmnCode: '',
  secureSecret: '',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: HashAlgorithm.SHA512,
  enableLog: true,
});
