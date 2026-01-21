import { z } from 'zod';

// Function to create a date field with preprocessing and required validation
const createDateField = (requiredMessage: string) => {
  return z
    .preprocess((value) => {
      // Treat empty string or null as null
      if (value === '' || value === null) {
        return null;
      }
      // Parse the date from the value
      const parsedDate = new Date(value as string);

      return isNaN(parsedDate.getTime()) ? null : parsedDate; // If invalid date, return null
    }, z.date().nullable()) // Allow null values in date processing
    .refine((date) => date !== null, {
      message: requiredMessage,
    });
};

export const elevatorRecordEditFormSchema = z.object({
  capacity: z.preprocess(
    (value) => Number(value), // Attempt to convert the value to a number before validation
    z
      .number({
        invalid_type_error: 'Capacity must be a number',
        required_error: 'Capacity is required',
      })
      .min(1, 'Capacity must be at least 1')
      .nullable()
  ),
  lastMaintenanceDate: createDateField('Last maintenance date is required'),
  nextMaintenanceDate: createDateField('Next maintenance date is required'),
  elevatorType: z.string().optional().nullable(),
  buildingName: z.string().optional().nullable(),
  elevatorLocation: z.string().optional().nullable(),
  id: z.string().optional(),
  status: z.string().optional().nullable(),
  lastInspectionDate: createDateField('Last Inspection date is required'),
  nextInspectionDate: createDateField('Next maintenance date is required'),
});
