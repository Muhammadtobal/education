import { registerEnumType } from '@nestjs/graphql';

export enum Direction {
  RIGHT_TO_LEFT = 'right_to_left',
  LEFT_TO_RIGHT = 'left_to_right',
}

registerEnumType(Direction, {
  name: 'Direction',
  description: 'Text direction (right to left or left to right)',
});
