import { ApiProperty } from '@nestjs/swagger';

export class SubCategotyDto {
  @ApiProperty()
  public readonly name!: string;
  @ApiProperty()
  public readonly category!: string;
}
