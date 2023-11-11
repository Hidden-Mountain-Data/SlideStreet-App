export interface DataUsage {
    id: number | null;
    eid: string;
    operationalImsi: string | null;
    type: 'DAILY'; // Assuming 'type' can only be 'DAILY', you can specify it as a literal type
    period: string; // If the format is consistent, consider using Date or a more specific type
    usage: number;
    mccMnc: string | null;
    pmn: string | null;
}