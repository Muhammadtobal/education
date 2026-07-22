import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsSingleNumberOrRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isSingleNumberOrRange",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;

          if (
            typeof value.value === "number" ||
            (typeof value === "object" && ("max" in value || "min" in value))
          )
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
