import * as yup from 'yup';
import {TFunction} from 'i18next';
import {TxKeyPath} from '../../i18n';
import {getTrErrorMessage} from './ErrorMessage';
import {inputEqualLength, inputMaxLength, inputMinLength} from './MaxLength';
import {regexPattern} from './RegexPattern';

const emailValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.email.label'))
    .max(
      inputMaxLength.email,
      errorMsg.maxLength('input.email.label', {
        length: inputMaxLength.email,
      }),
    )
    .matches(regexPattern.email, errorMsg.incorrect('input.email.label'))
    .nullable();
};

const phoneNumberValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.phoneNumber.label'))
    .length(
      inputEqualLength.phoneNumber,
      errorMsg.compare('input.phoneNumber.label', {
        length: inputEqualLength.phoneNumber,
      }),
    )
    .nonNullable();
};

const passwordValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.password.label'))
    .min(
      inputMinLength.password,
      errorMsg.minLength('input.password.label', {
        length: inputMinLength.password,
      }),
    )
    .nonNullable();
};

const passwordEditValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .notRequired()
    .min(
      inputMinLength.password,
      errorMsg.minLength('input.password.label', {
        length: inputMinLength.password,
      }),
    )
    .nullable();
};

const fullNameValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.fullName.label'))
    .min(
      inputMinLength.fullName,
      errorMsg.minLength('input.fullName.label', {
        length: inputMinLength.fullName,
      }),
    );
};

const foodNameValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.foodName.label'))
    .min(
      inputMinLength.fullName,
      errorMsg.minLength('input.foodName.label', {
        length: inputMinLength.fullName,
      }),
    );
};

const priceValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.foodPrice.label'))
    .matches(
      /^[0-9]+(\.[0-9]{1,2})?$/,
      errorMsg.incorrect('input.foodPrice.label'),
    ); // Đảm bảo chỉ chứa số, có thể có 2 chữ số thập phân
};

const seatNameValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.seatName.label'))
    .nonNullable();
};

const maxOfPeopleValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .string()
    .required(errorMsg.require('input.maxPeople.label'))
    .nonNullable();
};

const numberSeatGeneraterValidator = (t: TFunction<TxKeyPath, undefined>) => {
  const errorMsg = getTrErrorMessage(t);
  return yup
    .number()
    .required(errorMsg.require('input.createMultiSeat.label'))
    .min(2, errorMsg.minValue('input.createMultiSeat.label', {value: 2}) + ' 2')
    .max(
      150,
      errorMsg.maxValue('input.createMultiSeat.label', {value: 150}) + ' 150',
    );
};

export const Validators = {
  email: emailValidator,
  phoneNumber: phoneNumberValidator,
  password: passwordValidator,
  passwordByEdit: passwordEditValidator,
  fullName: fullNameValidator,
  foodName: foodNameValidator,
  foodPrice: priceValidator,
  seatName: seatNameValidator,
  maxOfPeople: maxOfPeopleValidator,
  numberSeatGenerater: numberSeatGeneraterValidator,
};
