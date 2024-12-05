
import { Connection } from 'mongoose';
import { Appointment, AppointmentSchema } from 'src/modules/appointments/appointments.schema';
import { Contact, ContactSchema } from 'src/modules/contacts/schemas/contacts.schema';
import { Recording, RecordingSchema } from 'src/modules/recordings/schemas/recording.schema';
import { User, UserSchema } from 'src/modules/users/user.schema';
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
      return tenantConnection.model(Contact.name,ContactSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  recordingModel: {
    provide: 'RECORDING_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Recording.name,RecordingSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};