import { ApiProperty } from "@nestjs/swagger";
import { Dto } from "src/dto";
import { ClassToDto } from "src/type-generators/class-to-dto";
import { SortingParameter } from "./sorting-parameter";

export class SortingRequest
{
  @ApiProperty({
    items:{ type: 'string', default: 'desc(CreationDate)' },
    description: 'Possible values: asc(Price), desc(Price), asc(TokenId), desc(TokenId), asc(CreationDate), desc(CreationDate).',
    required: false
  })
  public sort?: SortingParameter[];

  constructor(value: ClassToDto<SortingRequest>) {
    Dto.init(this, value);
  }
}