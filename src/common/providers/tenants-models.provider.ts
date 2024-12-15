
import { Connection } from 'mongoose';
import { Appointment, AppointmentSchema } from 'src/schemas/appointments.schema';
import { Campaign, CampaignSchema } from 'src/schemas/campaign.schema';
import { Contact, ContactSchema } from 'src/schemas/contacts.schema';
import { List, ListSchema } from 'src/schemas/list.sechema';
import { Recording, RecordingSchema } from 'src/schemas/recording.schema';
import { Role, RoleSchema } from '../../schemas/roles.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TwilioNumber, TwilioNumberSchema } from 'src/schemas/twilioNumber.schema';
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
  campaginModel: {
    provide: 'CAMPAGIN_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Campaign.name,CampaignSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
  twilioNumberModel: {
    provide: 'TWILIO_NUMBER_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(TwilioNumber.name,TwilioNumberSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};