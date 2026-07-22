import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsLatLon(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isLatLon",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value.lat === "number" && typeof value.lon === "number")
            return true;

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid shape filter object`;
        },
      },
    });
  };
}
