import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { UpdateInsuranceInfoDto } from './insurance.dto';
import { InsuranceService } from './insurance.service';
import { InsuranceStatus, PolicyFrequency } from './insurance.enum';
import { FilesService } from '../files/files.service';
import { CronExpressionParser } from 'cron-parser';

@Injectable()
export class InsuranceParserService {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => InsuranceService))
    private insuranceService: InsuranceService,
    private filesService: FilesService,
  ) {}

  private async parsePdf(
    filepath: string,
  ): Promise<UpdateInsuranceInfoDto | null> {
    try {
      const parserUrl = this.configService.getOrThrow<string>(
        'PDF_PARSER_SERVICE_URL',
      );

      const response = await fetch(parserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filepath }),
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to parse PDF',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const data = (await response.json()) as UpdateInsuranceInfoDto;
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'PDF parsing failed';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async parse(insuranceId: mongoose.Types.ObjectId): Promise<void> {
    try {
      const insurance = await this.insuranceService.findById(
        insuranceId.toString(),
      );

      await this.insuranceService.findByIdAndUpdate(insuranceId, {
        status: InsuranceStatus.Processing,
      });

      // Generate signed URL for the PDF file
      const fileUrl = await this.filesService.generateReadSignedUrl(
        insurance.filepath,
      );

      const maxRetries = 3;
      let parsedData: UpdateInsuranceInfoDto | null = null;
      let isComplete = false;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        parsedData = await this.parsePdf(fileUrl);

        if (parsedData && this.isDataComplete(parsedData)) {
          isComplete = true;
          break;
        }
      }

      if (isComplete && parsedData) {
        const calculatedNextDueDate = this.calculateNextDueDate(
          parsedData.policy_start_date!,
          parsedData.policy_frequency!,
          parsedData.next_due_date,
        );

        await this.insuranceService.findByIdAndUpdate(insuranceId, {
          ...parsedData,
          next_due_date: calculatedNextDueDate,
          status: InsuranceStatus.Processed,
        });
      } else {
        await this.insuranceService.findByIdAndUpdate(insuranceId, {
          ...(parsedData || {}),
          status: InsuranceStatus.Failed,
        });
      }
    } catch (error) {
      await this.insuranceService.findByIdAndUpdate(insuranceId, {
        status: InsuranceStatus.Failed,
      });
      throw error;
    }
  }

  private isDataComplete(data: UpdateInsuranceInfoDto): boolean {
    return !!(
      data.next_due_date &&
      data.policy_holder_name &&
      data.policy_start_date &&
      data.premium_amount &&
      data.last_premium_due_date &&
      data.policy_frequency
    );
  }

  private getCronExpression(
    frequency: PolicyFrequency,
    startDate: Date,
  ): string {
    const date = new Date(startDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11

    switch (frequency) {
      case PolicyFrequency.Monthly:
        return `0 0 ${day} * *`; // Same day of every month at midnight
      case PolicyFrequency.Yearly:
        return `0 0 ${day} ${month} *`; // Same day and month every year at midnight
    }
  }

  private calculateNextDueDate(
    startDate: Date,
    frequency: PolicyFrequency,
    currentDueDate?: Date,
  ): Date {
    const now = new Date();

    // If current due date is in the future, keep it as is
    if (currentDueDate && new Date(currentDueDate) > now) {
      return new Date(currentDueDate);
    }

    // Calculate next due date based on start date and frequency
    const cronExpression = this.getCronExpression(frequency, startDate);
    const interval = CronExpressionParser.parse(cronExpression, {
      currentDate: new Date(startDate),
      tz: 'Asia/Kolkata', // IST timezone
    });

    // Find the next occurrence after now
    let nextDate = interval.next().toDate();
    while (nextDate <= now) {
      nextDate = interval.next().toDate();
    }

    return nextDate;
  }
}
