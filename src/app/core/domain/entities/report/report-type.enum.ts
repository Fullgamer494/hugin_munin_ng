export enum ReportTypeEnum {
  CLINICAL = 1,
  BEHAVIORAL = 2,
  DIETARY = 3,
  DEATH = 4,
  TRANSFER = 5
}

export const REPORT_TYPE_NAMES: Record<ReportTypeEnum, string> = {
  [ReportTypeEnum.CLINICAL]: 'Clínico',
  [ReportTypeEnum.BEHAVIORAL]: 'Conductual',
  [ReportTypeEnum.DIETARY]: 'Alimenticio',
  [ReportTypeEnum.DEATH]: 'Defunción',
  [ReportTypeEnum.TRANSFER]: 'Traslado'
};

export const REPORT_TYPE_ROUTES: Record<ReportTypeEnum, string> = {
  [ReportTypeEnum.CLINICAL]: 'clinical',
  [ReportTypeEnum.BEHAVIORAL]: 'behavioral',
  [ReportTypeEnum.DIETARY]: 'dietary',
  [ReportTypeEnum.DEATH]: 'death',
  [ReportTypeEnum.TRANSFER]: 'transfer'
};