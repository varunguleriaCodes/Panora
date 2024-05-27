export interface closeContactInput{
    lead_id: string;
    name: string;
    title: string;
    phones: Phone[];
    emails: Email[];
    urls: Url[];
    [key: string]: any;
}
export interface closeContactOutput{
    id: string;
    organization_id: string;
    name: string;
    title: string;
    date_updated: string;
    created_by: string;
    date_created: string;
    updated_by: string;
    phones: Phone[];
    emails: Email[];
    urls: Url[];
    [key: string]: any; 
}
type Phone = {
    phone: string;
    type: string;
    phone_formatted?:string;
    country?:string;
}
  
type Email = {
    email: string;
    type: string;
    is_unsubscribed?:boolean;
}
  
type Url = {
    url: string;
    type: string;
}