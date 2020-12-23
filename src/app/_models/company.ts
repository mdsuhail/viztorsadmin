export interface Company {
    _id: string;
    name: string;
    email: string;
    contact: string;
    logo: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    website: string;
    slug: string;
    dbName: string;
    dbHost: string;
    dbUsername: string;
    dbPassword: string;
    dbPort: string;
    active: Boolean;
}