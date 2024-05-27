import {
    UnifiedContactInput,
    UnifiedContactOutput,
  } from '@crm/contact/types/model.unified';
  import { IContactMapper } from '@crm/contact/types';
  import { closeContactInput, closeContactOutput } from './types';
  import { Utils } from '@crm/@lib/@utils';
  
  export class closeContactMapper implements IContactMapper {
    private readonly utils: Utils;
  
    constructor() {
      this.utils = new Utils();
    }
  
    async desunify(
      source: UnifiedContactInput,
      customFieldMappings?: {
        slug: string;
        remote_id: string;
      }[],
    ): Promise<closeContactInput> {
      // Assuming 'email_addresses' array contains at least one email and 'phone_numbers' array contains at least one phone number
      const primaryEmail = source.email_addresses?.[0]?.email_address;
      const primaryEmailType=source.email_addresses?.[0]?.email_address_type;
      const primaryPhone = source.phone_numbers?.[0]?.phone_number;
      const primaryPhoneType=source.phone_numbers?.[0]?.phone_type;
      const emailObject = primaryEmail
      ? [{ email: primaryEmail, type: primaryEmailType }]
      : [];
     const phoneObject = primaryPhone
      ? [{ phone: primaryPhone, type: primaryPhoneType }]
      : [];
      const result: closeContactInput = {
        name: `${source.first_name} ${source.last_name}`,
        phones:phoneObject,
        emails:emailObject,
        urls:[],
        title:'',
        lead_id:''
      };
  
  
      if (source.user_id) {
        const owner_id = await this.utils.getRemoteIdFromUserUuid(source.user_id);
        if (owner_id) {
          result.lead_id = owner_id;
        }
      }
  
      if (customFieldMappings && source.field_mappings) {
        for (const [k, v] of Object.entries(source.field_mappings)) {
          const mapping = customFieldMappings.find(
            (mapping) => mapping.slug === k,
          );
          if (mapping) {
            result[mapping.remote_id] = v;
          }
        }
      }
  
      return result;
    }
  
    async unify(
      source: closeContactOutput | closeContactOutput[],
      customFieldMappings?: {
        slug: string;
        remote_id: string;
      }[],
    ): Promise<UnifiedContactOutput | UnifiedContactOutput[]> {
      if (!Array.isArray(source)) {
        return this.mapSingleContactToUnified(source, customFieldMappings);
      }
      // Handling array of CloseContactOutput
      return source.map((contact) =>
        this.mapSingleContactToUnified(contact, customFieldMappings),
      );
    }
  
    private mapSingleContactToUnified(
      contact: closeContactOutput,
      customFieldMappings?: {
        slug: string;
        remote_id: string;
      }[],
    ): UnifiedContactOutput {
      const field_mappings: { [key: string]: any } = {};
      if (customFieldMappings) {
        for (const mapping of customFieldMappings) {
          field_mappings[mapping.slug] = contact.properties[mapping.remote_id];
        }
      }
    const first_name=contact?.name?.split(' ')?.[0];
    const last_name=contact?.name?.split(' ')?.[1];
      return {
        remote_id: contact.id,
        first_name: first_name,
        last_name: last_name,
        email_addresses: contact?.emails?.map((e) => ({
            email_address: e.email,
            email_address_type:e.type,
          })),
        phone_numbers: contact?.phones?.map((p) => ({
            phone_number: p.phone,
            phone_type:  p.type,
          })),
        field_mappings,
        addresses: [],
      };
    }
  }
  