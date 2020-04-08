import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeedbackDto {
  @ApiProperty()
  public readonly product!: string;
  @ApiProperty()
  public readonly rate!: number;
  @ApiPropertyOptional()
  public readonly advantages?: string;
  @ApiPropertyOptional()
  public readonly limitations?: string;
  @ApiProperty()
  public readonly description!: string;
}
