
import { Connection } from 'mongoose';
import { Appointment, AppointmentSchema } from 'src/appointments/appointments.schema';
import { User, UserSchema } from 'src/users/user.schema';
export const tenantModels = {
  appointmentModel: {
    provide: 'APPOINTMENT_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Appointment.name,AppointmentSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  userModel: {
    provide: 'USERS_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(User.name,UserSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  contactModel: {
    provide: 'CONTACT_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(User.name,UserSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};