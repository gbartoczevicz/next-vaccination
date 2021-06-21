export interface ValidatePayload {
  setPayload(payload: any): ValidatePayload;
  setRequiredFields(requiredField: Array<string>): ValidatePayload;
  containsAllRequiredFields(): boolean;
  exibeMissingFields(): Array<string>;
}
