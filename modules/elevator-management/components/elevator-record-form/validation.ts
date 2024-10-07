import { isAfter } from 'date-fns';
import { z } from 'zod';

export const INITIAL_ELEVATOR_RECORD_FORM_VALUES = {
  elevatorDetails: {
    elevatorType: '',
    elevatorLocation: '',
    buildingName: '',
    capacity: null,
  },
  maintenanceInfo: {
    lastMaintenanceDate: undefined,
    nextMaintenanceDate: undefined,
    status: '',
  },
  technicianInfo: {
    technicianName: '',
    contactInformation: '',
  },
};

export const elevatorDetailsSchema = z.object({
  elevatorType: z.string().min(1, 'Elevator type is required'),
  elevatorLocation: z.string().min(1, 'Elevator location is required'),
  buildingName: z.string().min(1, 'Building name is required'),
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
});

export const maintenanceInfoSchema = z
  .object({
    lastMaintenanceDate: z.date({
      invalid_type_error: 'Last maintenance date must be a valid date',
      required_error: 'Last maintenance date is required',
    }),
    nextMaintenanceDate: z.date({
      invalid_type_error: 'Next maintenance date must be a valid date',
      required_error: 'Next maintenance date is required',
    }),
    status: z.string().min(1, 'Status is required'),
  })
  .superRefine((data, ctx) => {
    const { lastMaintenanceDate, nextMaintenanceDate } = data;

    if (lastMaintenanceDate && nextMaintenanceDate) {
      // Ensure the time of nextMaintenanceDate is later than lastMaintenanceDate
      if (!isAfter(nextMaintenanceDate, lastMaintenanceDate)) {
        ctx.addIssue({
          code: 'custom',
          path: ['nextMaintenanceDate'],
          message: 'Next maintenance date must be later than the last maintenance date',
        });
      }
    }
  });

export const technicianInfoSchema = z.object({
  technicianName: z.string().min(1, 'Technician name is required'),
  contactInformation: z
    .string({
      required_error: 'Contact Information is required',
    })
    .refine((value) => {
      const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return phoneRegex.test(value) || emailRegex.test(value);
    }, 'Contact Information must be a valid phone number or email address'),
});

export const elevatorRecordFormSchema = z.object({
  elevatorDetails: elevatorDetailsSchema,
  maintenanceInfo: maintenanceInfoSchema,
  technicianInfo: technicianInfoSchema,
});

export type ElevatorRecordFormFields = z.infer<typeof elevatorRecordFormSchema>;
