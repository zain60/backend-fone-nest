
import { Connection } from 'mongoose';
import { Appointment, AppointmentSchema } from 'src/appointments/appointments.schema';
export const tenantModels = {
  appointmentModel: {
    provide: 'APPOINTMENT_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Appointment.name,AppointmentSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};