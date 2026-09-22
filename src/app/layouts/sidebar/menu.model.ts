export interface MenuItem {
    id?: number;
    label?: string;
    icon?: string;
    link?: string;
    subItems?: any;
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
    roles?: string[];
    /** CrmPage value: shown to a CRM user only when the owner granted that page. */
    page?: number;
}
