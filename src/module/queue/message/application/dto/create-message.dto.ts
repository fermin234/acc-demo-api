import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '{"name":"john"}' })
  body: string;

  @ApiProperty({
    type: String,
    example: '219f8380-5770-4cc2-8c3e-5c715e145f5e',
  })
  messageId: string;

  @ApiProperty({
    type: String,
    example: 'AIDASSYFHUBOBT7F4XT75',
  })
  senderId: string;

  @ApiProperty({ type: String, example: 'queue-name' })
  queueName: string;

  @ApiPropertyOptional({
    type: String,
    default: null,
    example: '219f8380-5770-4cc2-8c3e-5c715e145f5e',
  })
  error?: string | null;

  @ApiProperty({ type: Date })
  createdAt: string;

  @ApiProperty({ type: Date })
  updatedAt: string;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: string;
}
