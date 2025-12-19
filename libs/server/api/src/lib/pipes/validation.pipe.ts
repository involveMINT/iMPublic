/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<unknown> {
    try {
      value = JSON.parse(value);
    } catch (e) {
      //Ignore error since the value could be a JSON Object already instead
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors as { constraints: {} }[])}`,
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }

  private toValidate(metaType: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }

  private formatErrors(errors: { constraints: {} }[]): string {
    return errors
      .map(({ constraints }) => {
        for (const value of Object.values(constraints)) {
          return value;
        }
      })
      .join(', ');
  }
}
