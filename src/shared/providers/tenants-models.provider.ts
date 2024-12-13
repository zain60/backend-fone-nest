
import { Connection } from 'mongoose';
import { Appointment, AppointmentSchema } from 'src/modules/appointments/schemas/appointments.schema';
import { Contact, ContactSchema } from 'src/modules/contacts/schemas/contacts.schema';
import { List, ListSchema } from 'src/modules/list/schemas/list.sechema';
import { Recording, RecordingSchema } from 'src/modules/recordings/schemas/recording.schema';
import { Role, RoleSchema } from 'src/modules/roles/schemas/roles.schema';
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
  listModel: {
    provide: 'LIST_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(List.name,ListSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  roleModel: {
    provide: 'ROLE_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Role.name,RoleSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};