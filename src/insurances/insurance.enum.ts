import { registerEnumType } from '@nestjs/graphql';

export enum InsuranceStatus {
  Created = 'Created',
  Processing = 'Processing',
  Processed = 'Processed',
}

registerEnumType(InsuranceStatus, { name: 'InsuranceStatus' });
