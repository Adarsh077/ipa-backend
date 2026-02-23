import { registerEnumType } from '@nestjs/graphql';

export enum InsuranceStatus {
  Created = 'Created',
  Processing = 'Processing',
  Processed = 'Processed',
  Failed = 'Failed',
}

export enum PolicyFrequency {
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

registerEnumType(InsuranceStatus, { name: 'InsuranceStatus' });
registerEnumType(PolicyFrequency, { name: 'PolicyFrequency' });
